const fs = require("fs");
const { exec } = require("child_process");

const awsController = {};

awsController.configure = (req, res, next) => {
  console.log("in awsController.configure -- my req -----> ", req.body);
  // PASS THESE TO BACKEND TO RUN THESE IN THE COMMAND LINE TO CONFIGURE AWS
  // let configureCommand1 = `aws2 configure set aws_access_key_id ${props.accessKey}`;
  // let configureCommand2 = `aws2 configure set aws_secret_access_key ${props.secretAccessKey}`;
  // let configureCommand3 = `aws2 configure set region ${props.region}`;
  // let configureCommand4 = `aws2 configure set output ${props.outputFormat}`;
  exec(
    `aws2 configure set aws_access_key_id ${req.body.accessKey}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
  //   exec(
  //     `aws2 configure set aws_access_key_id ${req.body.secretAccessKey}`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         return;
  //       }
  //       console.log(`stdout: ${stdout}`);
  //       console.error(`stderr: ${stderr}`);
  //     }
  //   );
  //   exec(
  //     `aws2 configure set aws_access_key_id ${req.body.region}`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         return;
  //       }
  //       console.log(`stdout: ${stdout}`);
  //       console.error(`stderr: ${stderr}`);
  //     }
  //   );
  //   exec(
  //     `aws2 configure set aws_access_key_id ${req.body.outputFormat}`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         return;
  //       }
  //       console.log(`stdout: ${stdout}`);
  //       console.error(`stderr: ${stderr}`);
  //     }
  //   );
  return next();
};

awsController.deploy = (req, res, next) => {
  // RUN THE TWO COMMANDS BELOW IN TERMINAL
  //   let bucketNameCommand1 = `sam package \
  //     --template-file template.yml \
  //     --output-template-file package.yml \
  //     --s3-bucket ${props.S3BucketName}`; //
  //   let bucketNameCommand2 = `sam deploy \
  //     --template-file package.yml \
  //     --stack-name my-date-time-app \
  //     --capabilities CAPABILITY_IAM`;
  return next();
};

module.exports = awsController;
