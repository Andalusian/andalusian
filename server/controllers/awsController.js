const fs = require("fs");
const AWS = require("aws-sdk");
const request = require('superagent'); // npm install superagent
const zipper = require("zip-local"); // npm i zip-local

const awsController = {};

awsController.configureAWS = (req, res, next) => {
  let data = `{ "accessKeyId": ${JSON.stringify(req.body.awsAccessKey)}, "secretAccessKey": ${JSON.stringify(req.body.awsSecretAccessKey)} , "region": ${JSON.stringify(req.body.awsRegion)}  }`;
  fs.writeFileSync(`users/${req.body.username}/aws/credentials.json`, data, (err) => {
    if (err) { console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.configureAWS | ERROR: ", err) }
    else { console.log("awsController.configureAWS COMPLETED") }
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
    "Role": "arn:aws:iam::" + `${res.locals.awsAccountID.Account}` + `${req.body.awsRole}`,
    "Runtime": `${req.body.awsRuntime}`
  };
  console.log("awsController.createFunction PARAMS", params)
  lambda.createFunction(params, (err, data) => {
    console.log("awsController.createFunction PARAMS in", params)

    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.createFunction | ERROR: ", err, err.stack);
      return (err)
    } else { console.log("awsController.createFunction COMPLETED") }
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
  lambda.updateFunctionCode(params, (err, data) => {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.updateFunction | ERROR: ", err, err.stack);
      return (err)
    } else { console.log("awsController.udpateFunction COMPLETED") }
  })
  return next();
}

awsController.listFunctions = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
  const lambda = new AWS.Lambda();
  const params = {}
  lambda.listFunctions(params, (err, data) => {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.listFunctions | ERROR: ", err)
      return (err)
    } else {
      console.log("awsController.listFunctions COMPLETED");
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
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.invokeFunc | ERROR: ", err)
      return (err)
    }
    console.log("awsController.invokeFunc COMPLETED")
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
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.deleteFunc | ERROR: ", err)
      return (err)
    } else { console.log("awsController.deleteFunc COMPLETED") }
    return next();
  });
}

awsController.allBuckets = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const s3 = new AWS.S3();
  const params = {}
  s3.listBuckets(params, (err, data) => {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.allBuckets | ERROR: ", err)
      return (err)
    } else {
      console.log("awsController.allBuckets COMPLETED");
      res.locals.buckets = data;
    }
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
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.loadCode 1 | ERROR: ", error);
      })
      .pipe(fs.createWriteStream(`users/${req.body.username}/aws/${req.body.funcName}.zip`))
      .on('finish', function () {
        zipper.sync.unzip(`users/${req.body.username}/aws/${req.body.funcName}.zip`).save(`users/${req.body.username}/aws/`);
        fs.readFile(`users/${req.body.username}/aws/${req.body.funcName}.js`, 'utf8', (err, data) => {
          if (err) { console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.loadCode 2 | ERROR: ", err) }
          else {
            res.locals.codeLoaded = data;
            return next();
          }
        })
      })
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.loadCode 3 | ERROR: ", err)
      return err;
    }
    else { console.log("awsController.loadCode COMPLETED") }
  })
}

awsController.getFuncInfo = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.getFuncInfo | ERROR: ", err)
      next(err);
    } else {
      console.log("awsController.getFuncInfo COMPLETED")
      res.locals.funcInfo = [];
      res.locals.funcInfo[0] = data;
    }
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
    if (err) console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.getInvocationInfo | ERROR: ", err, err.stack);
    else {
      console.log("awsController.getInvocationInfo COMPLETED");
      res.locals.funcInfo[1] = data;
    }
    return next();
  });
}

awsController.createBucket = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const s3 = new AWS.S3();
  const params = {
    Bucket: `${req.body.S3BucketName} `,
    CreateBucketConfiguration: {
      LocationConstraint: `${req.body.newBucketRegion}`
    }
  };
  s3.createBucket(params, function (err, data) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.createBucket | ERROR: ", err, err.stack);
      return (err)
    }
    else {
      console.log("awsController.createBucket COMPLETED");
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
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.getawsAccountID | ERROR: ", err, err.stack);
      return (err)
    }
    else {
      console.log("awsController.getawsAccountID COMPLETED")
      res.locals.awsAccountID = data;
      return next();
    }
  })
}


module.exports = awsController;