const fs = require("fs");
const AWS = require("aws-sdk");
const request = require('superagent'); // npm install superagent
const zipper = require("zip-local"); // npm i zip-local

const awsController = {};

// One of the ways to configure AWS account to use it's SDK is to create a credentials.json file with the user's "accessKeyId", "secretAccessKey" and "region". This function does that using the information sent from the frontend.
awsController.configureAWS = (req, res, next) => {
  let data = `{ "accessKeyId": ${JSON.stringify(req.body.awsAccessKey)}, "secretAccessKey": ${JSON.stringify(req.body.awsSecretAccessKey)} , "region": ${JSON.stringify(req.body.awsRegion)}  }`;
  fs.writeFileSync(`users/${req.body.username}/aws/credentials.json`, data, (err) => {
    if (err) { console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.configureAWS | ERROR: ", err) }
    else { console.log("awsController.configureAWS COMPLETED") }
  });
  return next();
}

// For all AWS SDK function, credentials.json is read first, then the AWS SDK function is ran. The deploy a new function using "lambda.createFunction", a file with the function code needs to be created, then zipped. lambda.createFunction requires params, which is an object that can include many key/value pairs, but at the minimum, it needs a ZipFile (which is given the same name as the function name for simplicity), FunctionName, Role and Runtime (all sent from the frontend).
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

// This is similar to createFunction. The difference is since the function is already deployed, role and runtime are not required.
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

// After reading the credentials.json file, lambda.listFunctions (which takes no parameters) will retrieve a list of deployed functions.
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

// After reading the credentials.json file, lambda.invoke takes a function name as its only parameter, and will invoke a deployed function.
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

// After reading the credentials.json file, lambda.deleteFunction takes a function name as its only parameter, and will delete a deployed function.
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

// awsController.allBuckets = (req, res, next) => {
//   AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
//   const s3 = new AWS.S3();
//   const params = {}
//   s3.listBuckets(params, (err, data) => {
//     if (err) {
//       console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.allBuckets | ERROR: ", err)
//       return (err)
//     } else {
//       console.log("awsController.allBuckets COMPLETED");
//       res.locals.buckets = data;
//     }
//     return next();
//   });
// }

// After reading the credentials.json file, lambda.getFunction takes a function name as its only parameter, retrieves a set of data on the function. One of the data is a link that allows user to download a zipfile a deployed function with it's code. The file is then unzipped, and the contents are sent to the frontend.
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

// After reading the credentials.json file, lambda.getFunction takes a function name as its only parameter, retrieves a set of data on the function.
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

// After reading the credentials.json file, cloudwatchlogs.describeLogStreams takes a function name as its only parameter, retrieves invocation information of that function.
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

// awsController.createBucket = (req, res, next) => {
//   AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
//   const s3 = new AWS.S3();
//   const params = {
//     Bucket: `${req.body.S3BucketName} `,
//     CreateBucketConfiguration: {
//       LocationConstraint: `${req.body.newBucketRegion}`
//     }
//   };
//   s3.createBucket(params, function (err, data) {
//     if (err) {
//       console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| awsController.createBucket | ERROR: ", err, err.stack);
//       return (err)
//     }
//     else {
//       console.log("awsController.createBucket COMPLETED");
//       return next();
//     }
//   })
// }

// This function is used when a function is being deployed. A part of "role" parameter includes the user's AWS account ID, which is retrieved automatically with sts.getCallerIdentity.
awsController.getawsAccountID = (req, res, next) => {
  AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`)
  const sts = new AWS.STS();
  const params = {};
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