const fs = require("fs");
const { exec } = require("child_process");

const awsController = {};

// FROM TALYA TO SCOTT: CALLBACK HELL BEGINS..
awsController.configure = (req, res, next) => {
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

awsController.deploy = (req, res, next) => {

  exec(
    `mkdir SAMUploadFolder`,
    (error, stdout, stderr) => {
      exec(
        `cd ./SAMUploadFolder`,
        (error, stdout, stderr) => {
          exec(
            `echo "AWSTemplateFormatVersion: '2010-09-09'
  Transform: AWS::Serverless-2016-10-31  \n
  Resources:
    ${req.body.functionName}:
      Type: AWS::Serverless::Function
      Properties:
        Handler: ${req.body.functionName}.handler
        Runtime: nodejs8.10" >> template.yml`,
            (error, stdout, stderr) => {
              exec(
                `touch ${req.body.functionName}.js`,
                (error, stdout, stderr) => {
                  exec(
                    `sam package --template-file template.yml --output-template-file package.yml --s3-bucket ${req.body.S3BucketName}`,
                    (error, stdout, stderr) => {
                      exec(
                        `sam deploy --template-file package.yml --stack-name ${req.body.functionName} --capabilities CAPABILITY_IAM`,
                        (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                          console.log(`stdout: ${stdout}`);
                          console.error(`stderr: ${stderr}`);
                          return next();
                        }
                      );
                    })
                })
            })
        })
    })

  //  exec(
  //     `mkdir SAMUploadFolder`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         return;
  //       }
  //       console.log(`stdout: ${stdout}`);
  //       console.error(`stderr: ${stderr}`);
  //     }
  //   );

  // await exec(
  //   `cd ./SAMUploadFolder`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  // );

  // await exec(
  //   `echo "AWSTemplateFormatVersion: '2010-09-09'
  // Transform: AWS::Serverless-2016-10-31  \n
  // Resources:
  //   ${req.body.functionName}:
  //     Type: AWS::Serverless::Function
  //     Properties:
  //       Handler: ${req.body.functionName}.handler
  //       Runtime: nodejs8.10" >> template.yml`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  // );

  // await exec(
  //   `touch ${req.body.functionName}.js`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  // );

  // await exec(
  //   `sam package --template-file template.yml --output-template-file package.yml --s3-bucket ${req.body.S3BucketName}`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  // );

  // await exec(
  //   `sam deploy --template-file package.yml --stack-name ${req.body.functionName} --capabilities CAPABILITY_IAM`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  // );

  // REMINDER TO SELF - SET UP TO DELETE THE FOLDER AFTER THE PROCESS IS COMPLETED


};

awsController.listFunctions = (req, res, next) => {
  exec(
    `aws2 lambda list-functions`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      // FROM TALYA TO SCOTT: WHEN YOU CONSOLE LOG STDOUT, IT GIVES ME THE FUNCTIONS ARRAY WHICH IS WHAT I WANT. BUT WHEN IT GETS TO THE FRONT END AND A CONSOLE LOG THE RESPONSE, IT LOOKS LIKE THIS {data: "", status: 200, statusText: "OK", headers: {…}, config: {…}, …} SO I CAN'T PROCESS IT YET
      res.locals.func = stdout;
      console.log("MY RES ----> ", res.locals.func)
      console.error(`stderr: ${stderr}`);
    }
  );
  return next();
}
module.exports = awsController;
