const fs = require("fs");
const { exec } = require("child_process");

const awsController = {};

// FROM TALYA TO SCOTT: CALLBACK HELL BEGINS..
awsController.configureAWS = (req, res, next) => {
  exec(
    `aws2 configure set aws_access_key_id ${req.body.accessKey}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      //   console.log(`stdout: ${stdout}`);
      //   console.error(`stderr: ${stderr}`);
    }
  );

  exec(
    `aws2 configure set aws_secret_access_key ${req.body.secretAccessKey}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  );

  exec(
    `aws2 configure set region ${req.body.region}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  );

  exec(
    `aws2 configure set output ${req.body.outputFormat}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  );
  return next();
};

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
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
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
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
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
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          return next();
        })
    }
  );

  // IT TOOK ABOUT 2-3 MINUTES TO DEPLOY. ONCE DEPLOYED, YOU CAN SEE THE FUNCTION IN AWS CLOUDFORMATION AND LAMBDA
  // https://us-west-2.console.aws.amazon.com/cloudformation/home
  // https://us-west-2.console.aws.amazon.com/lambda/home
};

// REMINDER TO SELF - SET UP TO DELETE THE FOLDER AFTER THE PROCESS IS COMPLETED

awsController.listFunctions = (req, res, next) => {
  exec(
    `aws2 lambda list-functions`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      res.locals.func = stdout;
      console.error(`stderr: ${stderr}`);
      return next();
    }
  );
}

awsController.allBuckets = (req, res, next) => {
  exec(
    `aws2 s3api list-buckets`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      res.locals.buckets = stdout;
      console.error(`stderr: ${stderr}`);
      return next();
    }
  );
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
      console.error(`stderr: ${stderr}`);
      return next();
    }
  );
}

awsController.getFuncInfo = (req, res, next) => {
  exec(
    `aws2 lambda get-function --function-name ${req.body.funcName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      res.locals.funcInfo = stdout;
      console.error(`stderr: ${stderr}`);
      return next();
    }
  );
}

awsController.createBucket = (req, res, next) => {
  exec(
    `aws2 s3api create-bucket --bucket ${req.body.S3BucketName} --region ${req.body.newBucketRegion} --create-bucket-configuration LocationConstraint=${req.body.newBucketRegion}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.error(`stderr: ${stderr}`);
      return next();
    }
  );
}


// awsController.deleteBucket = (req, res, next) => {
//   console.log("controller body --->", req.body)
//   exec(
//     `aws2 s3api delete-bucket --bucket ${req.body}`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//       }
//       res.locals.buckets = stdout;
//       console.log("MY RES ----> ", res.locals.buckets)
//       console.error(`stderr: ${stderr}`);
//       return next();
//     }
//   );
// }


module.exports = awsController;
