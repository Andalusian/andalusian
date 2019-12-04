const fs = require("fs");
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();
const request = require('superagent');
const admZip = require('adm-zip');

const awsController = {};

awsController.configureAWS = (req, res, next) => {
  if (!fs.existsSync(`${req.body.username}`)) {
    fs.mkdirSync(`${req.body.username}`)
  }
  let data = `{ "accessKeyId": ${JSON.stringify(req.body.awsAccessKey)}, "secretAccessKey": ${JSON.stringify(req.body.awsSecretAccessKey)} , "region": ${JSON.stringify(req.body.awsRegion)}  }`;
  fs.writeFileSync(`${req.body.username}/credentials.json`, data, (err) => {
    if (err) { console.log(err) }
  });
  return next();
}

awsController.createFunction = (req, res, next) => {
  console.log("in awsController.createFunction BACKEND")
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`);
  const lambda = new AWS.Lambda();
  fs.writeFileSync(`${req.body.username}/${req.body.functionName}.js`, req.body.uploadedFunction)
  exec(`zip ${req.body.username}/${req.body.functionName}.zip ${req.body.username}/${req.body.functionName}.js`, (error, stdout, stderr) => {
    const params = {
      "Code": {
        // "S3Bucket": `${req.body.S3BucketName}`,
        // "S3Key": "",
        // "S3ObjectVersion": "",
        "ZipFile": fs.readFileSync(`${req.body.username}/${req.body.functionName}.zip`)
      },
      "FunctionName": `${req.body.functionName}`,
      "Handler": `${req.body.functionName}` + ".handler",
      "Role": "arn:aws:iam::" + `${req.body.awsAccountID}` + `${req.body.awsRole}`,
      "Runtime": `${req.body.awsRuntime}`
    };
    console.log(params);
    lambda.createFunction(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return (err)
      }
      else {
        console.log("WHATTTT -->", data);
      }
    })
    if (error) {
      console.error(`exec error: ${error}`);
      return (error)
    }
    console.log(`createFunction stdout: ${stdout}`);
    console.error(`createFunction stderr: ${stderr}`);
    return next();
  })
}
// REMINDER TO SELF - SET UP TO DELETE THE FOLDER AFTER THE PROCESS IS COMPLETED

awsController.listFunctions = (req, res, next) => {

  AWS.config.loadFromPath(`${req.body.username}/credentials.json`, function (err, data) {
    if (err) {
      console.log('noooooooo');
    } else {
      console.log('flop');
    }
  });
  console.log("in awsController.listFunctions")
  const lambda = new AWS.Lambda();
  const params = {}
  lambda.listFunctions(params, (err, data) => {
    console.log("in lambda")
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
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
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
  console.log("awsController.deleteFunc REQ BODY --->", req.body)
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
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
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
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

// awsController.loadCode = (req, res, next) => {
//   AWS.config.loadFromPath(`${req.body.username}/credentials.json`);
//   const lambda = new AWS.Lambda();
//   const params = { FunctionName: `${req.body.funcName}` }
//   lambda.getFunction(params, (err, data) => {
//     console.log("data.Code.Location ---->", data.Code.Location)
//     const href = data.Code.Location;
//     const zipFile = 'aster.zip';
//     const extractEntryTo = `${zipFile}-master/`;
//     const outputDir = `./${zipFile}-master/`;
//     request
//       .get(href)
//       .on('error', function (error) {
//         console.log(error);
//       })
//       .pipe(fs.createWriteStream(zipFile))
//       // .then(data => console.log("DATATDATAT", data))
//       .on('finish', function () {

//         const zip = new admZip(zipFile);
//         zip.extractEntryTo(extractEntryTo, outputDir, false, true);

//       });
//     if (err) {
//       console.log("err: ", err)
//       return
//     }
//     res.locals.funcCode = data.Code.Location;
//     console.log("data.Code.Location ---->", data.Code.Location)
//     exec(`open '${data.Code.Location}'`, (error, stdout, stderr) => {
//       exec(`~`, (error, stdout, stderr) => { })
//     })
//     return next();
//   }
//   )
// }

awsController.getFuncInfo = (req, res, next) => {
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      next(err);
    }
    res.locals.funcInfo = data;
    return next();
  });
}

awsController.createBucket = (req, res, next) => {
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
  // const s3 = new AWS.S3();
  const params = {
    Bucket: `${req.body.S3BucketName} `,
    CreateBucketConfiguration: {
      LocationConstraint: `${req.body.newBucketRegion}`
    }
  };
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
  AWS.config.loadFromPath(`${req.body.username}/credentials.json`)
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
