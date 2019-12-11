const fs = require("fs");
const AWS = require("aws-sdk");
const request = require('superagent'); // npm install superagent
const zipper = require("zip-local"); // npm i zip-local
// const { exec } = require("child_process");


const awsController = {};

awsController.configureAWS = (req, res, next) => {
  let data = `{ "accessKeyId": ${JSON.stringify(req.body.awsAccessKey)}, "secretAccessKey": ${JSON.stringify(req.body.awsSecretAccessKey)} , "region": ${JSON.stringify(req.body.awsRegion)}  }`;
  fs.writeFileSync(`users/${req.body.username}/aws/credentials.json`, data, (err) => {
    if (err) { console.log(err) }
  });
  return next();
}

awsController.createFunction = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
  const lambda = new AWS.Lambda();
  fs.writeFileSync(`users/${req.body.username}/aws/${req.body.functionName}.js`, req.body.uploadedFunction);
  zipper.sync.zip(`users/${req.body.username}/aws/${req.body.functionName}.js`).compress().save(`users/${req.body.username}/aws/${req.body.functionName}.zip`);
  const params = {
    "Code": {
      "ZipFile": fs.readFileSync(`users/${req.body.username}/aws/${req.body.functionName}.zip`)
    },
    "FunctionName": `${req.body.functionName}`,
    "Handler": `${req.body.functionName}` + ".handler",
    "Role": "arn:aws:iam::" + `${req.body.awsAccountID}` + `${req.body.awsRole}`,
    "Runtime": `${req.body.awsRuntime}`
  };
  console.log("PARAMS --->", params)
  lambda.createFunction(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return (err)
    }
    else {
      console.log("function created -->", data);
    }
  })
  return next();
}

awsController.updateFunction = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
  const lambda = new AWS.Lambda();
  fs.writeFileSync(`users/${req.body.username}/aws/${req.body.functionName}.js`, req.body.uploadedFunction);
  zipper.sync.zip(`users/${req.body.username}/aws/${req.body.functionName}.js`).compress().save(`users/${req.body.username}/aws/${req.body.functionName}.zip`);
  const params = {
    "FunctionName": `${req.body.functionName}`,
    "ZipFile": fs.readFileSync(`users/${req.body.username}/aws/${req.body.functionName}.zip`),
  };
  console.log("PARAMS --->", params)
  lambda.updateFunctionCode(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return (err)
    }
    else {
      console.log("function created -->", data);
    }
  })
  return next();
}

awsController.listFunctions = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
  const lambda = new AWS.Lambda();
  const params = {}
  lambda.listFunctions(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return (err)
    } else {
      res.locals.func = data;
    }
    return next();
  });
}

awsController.invokeFunc = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.invoke(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return (err)
    }
    res.locals.func = data;
    return next();
  });
}

awsController.deleteFunc = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.deleteFunction(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return (err)
    }
    return next();
  });
}

awsController.allBuckets = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const s3 = new AWS.S3();
  const params = {}
  s3.listBuckets(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return (err)
    }
    res.locals.buckets = data;
    return next();
  });
}

awsController.loadCode = async (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    const href = data.Code.Location;
    request
      .get(href)
      .on('error', function (error) {
        console.log(error);
      })
      .pipe(fs.createWriteStream(`users/${req.body.username}/aws/${req.body.funcName}.zip`))
      .on('finish', function () {
        zipper.sync.unzip(`users/${req.body.username}/aws/${req.body.funcName}.zip`).save(`users/${req.body.username}/aws/`);
        fs.readFile(`users/${req.body.username}/aws/${req.body.funcName}.js`, 'utf8', (err, data) => {
          if (err) { console.log(err) }
          else {
            res.locals.codeLoaded = data;
            return next();
          }
        })
      })
    if (err) {
      console.log("err: ", err)
      return err;
    }
  })
  // fs.rmdirSync(`users/${req.body.username}/aws/${req.body.funcName}.js`);
  // fs.rmdirSync(`users/${req.body.username}/aws/${req.body.funcName}.zip`);
}

awsController.getFuncInfo = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      next(err);
    }
    res.locals.funcInfo = [];
    res.locals.funcInfo[0] = data;
    return next();
  });
}

awsController.getInvocationInfo = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const cloudwatchlogs = new AWS.CloudWatchLogs();
  var params = {
    logGroupName: `/aws/lambda/${req.body.funcName}`
  };
  cloudwatchlogs.describeLogStreams(params, function (err, data) {
    if (err) console.log(err, err.stack);
    res.locals.funcInfo[1] = data;
    return next();
  });
}

awsController.createBucket = (req, res, next) => {
  console.log(req.body)
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const s3 = new AWS.S3();
  const params = {
    Bucket: `${req.body.S3BucketName} `,
    CreateBucketConfiguration: {
      LocationConstraint: `${req.body.newBucketRegion}`
    }
  };
  console.log("PARAMS -----> ", params)
  s3.createBucket(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      return (err)
    }
    else {
      console.log(data);
      return next();
    }
  })
}

awsController.getawsAccountID = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const sts = new AWS.STS();
  const params = {
  };
  sts.getCallerIdentity(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      return (err)
    }
    else {
      res.locals.awsAccountID = data;
      return next();
    }
  })
}


module.exports = awsController;