const fs = require("fs");
const { exec } = require("child_process");
var AWS = require("aws-sdk");

const awsController = {};

awsController.configureAWS = (req, res, next) => {
  exec(
    `echo '{ "accessKeyId": ${req.body.accessKey}, "secretAccessKey": ${req.body.secretAccessKey}, "region": ${req.body.region} }'  >> credentials.json`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`configureAWS stdout: ${stdout}`);
      console.error(`configureAWS stderr: ${stderr}`);
    }
  );
}

awsController.configureTemp = (req, res, next) => {
  exec(
    `echo 'AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31  \n
Resources:
    ${req.body.functionName}:
      Type: AWS::Serverless::Function
      Properties:
        Handler: ${req.body.functionName}.handler
        Runtime: nodejs8.10' >> template.yml`,
    (error, stdout, stderr) => {
      exec(
        `echo "${req.body.codeHere}" >> ${req.body.functionName}.js`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`configureTemp stdout: ${stdout}`);
          console.error(`configureTemp stderr: ${stderr}`);
          return next();
        })
    })
}

awsController.packageSAM = (req, res, next) => {

  console.log("in packageSAM cont")
  exec(
    `sam package --template-file template.yml --output-template-file package.yml --s3-bucket ${req.body.S3BucketName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`packageSAM stdout: ${stdout}`);
      console.error(`packageSAM stderr: ${stderr}`);
      return next();
    })
  // IT TOOK ABOUT 2-3 MINUTES TO PACKAGE
}

awsController.deploy = (req, res, next) => {
  exec(
    `sam deploy --template-file package.yml --stack-name ${req.body.functionName} --capabilities CAPABILITY_IAM`,
    (error, stdout, stderr) => {
      exec(
        `rm template.yml package.yml ${req.body.functionName}.js`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`deploy stdout: ${stdout}`);
          console.error(`deploy stderr: ${stderr}`);
          return next();
        })
    }
  );

  // IT TOOK ABOUT 2-3 MINUTES TO DEPLOY. ONCE DEPLOYED, YOU CAN SEE THE FUNCTION IN AWS CLOUDFORMATION AND LAMBDA
  // https://us-west-2.console.aws.amazon.com/cloudformation/home
  // https://us-west-2.console.aws.amazon.com/lambda/home
};

awsController.createFunction = (req, res, next) => {
  AWS.config.loadFromPath("./credentials.json")
  const lambda = new AWS.Lambda();
  var params = {
    Code: {
      S3Bucket: `${req.body.S3BucketName}`,
      S3Key: 'blahblahblahblahblahblahblah',
      S3ObjectVersion: 'blahblahblahblahblahblahblah',
      ZipFile: Buffer.from('...')
    },
    FunctionName: `${req.body.functionName}`,
    Handler: `${req.body.functionName}`.handler,
    Role: "arn:aws:iam::466253788069:role/ADMINPOTATO",
    Runtime: "nodejs"
  };
  lambda.createFunction(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
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
    console.log("data: ", data)
    res.locals.func = data;
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

awsController.getCurrRegion = (req, res, next) => {
  exec(
    `aws2 configure get region`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      res.locals.region = stdout;
      console.error(`getCurrRegion stderr: ${stderr}`);
      return next();
    }
  );
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
  exec(
    `aws2 s3api create-bucket --bucket ${req.body.S3BucketName} --region ${req.body.newBucketRegion} --create-bucket-configuration LocationConstraint=${req.body.newBucketRegion}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.error(`createBucket stderr: ${stderr}`);
      return next();
    }
  );
}




module.exports = awsController;
