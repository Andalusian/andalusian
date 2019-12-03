'use strict';

const fs = require("fs");
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();
const request = require('superagent');
const admZip = require('adm-zip');

const awsController = {};

awsController.configureAWS = (req, res, next) => {
  fs.unlinkSync('./credentials.json');
  let data = `{ "accessKeyId": ${JSON.stringify(req.body.awsAccessKey)}, "secretAccessKey": ${JSON.stringify(req.body.awsSecretAccessKey)} , "region": ${JSON.stringify(req.body.awsRegion)}  }`;
  fs.writeFile('credentials.json', data, (err) => {
    if (err) throw err
  });
}

awsController.createFunction = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json");
  const lambda = new AWS.Lambda();
  fs.writeFileSync(`${req.body.functionName}.js`, req.body.uploadedFunction, (err) => {
    if (err) throw err
  })
  exec(`zip function.zip ${req.body.functionName}.js`, (error, stdout, stderr) => {
    const params = {
      "Code": {
        // "S3Bucket": `${req.body.S3BucketName}`,
        // "S3Key": "",
        // "S3ObjectVersion": "",
        "ZipFile": fs.readFileSync("function.zip")
      },
      "FunctionName": `${req.body.functionName}`,
      "Handler": `${req.body.functionName}` + ".handler",
      "Role": "arn:aws:iam::" + `${req.body.awsAccountID}` + `${req.body.awsRole}`,
      "Runtime": `${req.body.awsRuntime}`
    };
    console.log(params);
    lambda.createFunction(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else {
        console.log("WHATTTT -->", data);
        return next();
      }
    })
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`createFunction stdout: ${stdout}`);
    console.error(`createFunction stderr: ${stderr}`);
  })
}
// REMINDER TO SELF - SET UP TO DELETE THE FOLDER AFTER THE PROCESS IS COMPLETED

awsController.listFunctions = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const lambda = new AWS.Lambda();
  const params = {}
  lambda.listFunctions(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return
    }
    res.locals.func = data;
    return next();
  });
}

awsController.invokeFunc = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.invoke(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return
    }
    res.locals.func = data;
    return next();
  });
}

awsController.deleteFunc = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.deleteFunction(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return
    }
    return next();
  });
}

awsController.allBuckets = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const s3 = new AWS.S3();
  const params = {}
  s3.listBuckets(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return
    }
    res.locals.buckets = data;
    return next();
  });
}

awsController.loadCode = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json");
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    console.log("data.Code.Location ---->", data.Code.Location)
    const href = data.Code.Location;
    const zipFile = 'aster.zip';
    const extractEntryTo = `${zipFile}-master/`;
    const outputDir = `./${zipFile}-master/`;
    request
      .get(href)
      .on('error', function (error) {
        console.log(error);
      })
      .pipe(fs.createWriteStream(zipFile))
      // .then(data => console.log("DATATDATAT", data))
      .on('finish', function () {

        const zip = new admZip(zipFile);
        zip.extractEntryTo(extractEntryTo, outputDir, false, true);

      });
    if (err) {
      console.log("err: ", err)
      return
    }
    res.locals.funcCode = data.Code.Location;
    console.log("data.Code.Location ---->", data.Code.Location)
    exec(`open '${data.Code.Location}'`, (error, stdout, stderr) => {
      exec(`~`, (error, stdout, stderr) => { })
    })
    return next();
  }
  )
}

awsController.getFuncInfo = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const lambda = new AWS.Lambda();
  const params = { FunctionName: `${req.body.funcName}` }
  lambda.getFunction(params, (err, data) => {
    if (err) {
      console.log("err: ", err)
      return
    }
    res.locals.funcInfo = data;
    return next();
  });
}

awsController.createBucket = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  // const s3 = new AWS.S3();
  const params = {
    Bucket: `${req.body.S3BucketName} `,
    CreateBucketConfiguration: {
      LocationConstraint: `${req.body.newBucketRegion}`
    }
  };
  s3.createBucket(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  })
}

awsController.getawsAccountID = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const sts = new AWS.STS();
  const params = {
  };
  sts.getCallerIdentity(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      res.locals.awsAccountID = data;
      return next();

    }
  })
}


module.exports = awsController;
