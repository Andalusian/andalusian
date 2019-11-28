import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import axios from "axios";

const AWSFunctionForm = props => {
  function configure() {
    // PASS THESE TO BACKEND TO RUN THESE IN THE COMMAND LINE TO CONFIGURE AWS
    // let configureCommand1 = `aws2 configure set aws_access_key_id ${props.accessKey}`;
    // let configureCommand2 = `aws2 configure set aws_secret_access_key ${props.secretAccessKey}`;
    // let configureCommand3 = `aws2 configure set region ${props.region}`;
    // let configureCommand4 = `aws2 configure set output ${props.outputFormat}`;

    axios
      .post("/aws/configure", {
        accessKey: props.accessKey,
        secretAccessKey: props.secretAccessKey,
        region: props.region,
        outputFormat: props.outputFormat
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function AWSDeploy() {
    // PASS THESE TO BACKEND TO RUN THE TWO COMMANDS BELOW IN TERMINAL
    // let bucketNameCommand1 = `sam package \
    // --template-file template.yml \
    // --output-template-file package.yml \
    // --s3-bucket ${props.S3BucketName}`; //
    // let bucketNameCommand2 = `sam deploy \
    // --template-file package.yml \
    // --stack-name my-date-time-app \
    // --capabilities CAPABILITY_IAM`;
    axios
      .post("/aws/deploy", {
        S3BucketName: props.S3BucketName
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <React.Fragment>
      <input type="text" name="functionName" placeholder="Function Name" />
      <select>
        <option value="node8">Node 8</option>
        <option value="node10">Node 10</option>
        <option value="python37">Python 3.7</option>
        <option value="go111">Go 1.11</option>
        <option value="go113">Go 1.13</option>
      </select>
      <pre>
        <h4>Configuration</h4>
        <input
          type="text"
          name="accessKey"
          placeholder="Access key ID"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="text"
          name="secretAccessKey"
          placeholder="Secret access key"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="text"
          name="region"
          placeholder="Region"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="text"
          name="outputFormat"
          placeholder="Output Format"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <button onClick={configure()}>Save Configuration</button>
        <h4>SAM Template</h4>
        <textarea rows="10" spellCheck="false">
          AWSTemplateFormatVersion: "2010-09-09" // Transform:
          AWS::Serverless-2016-10-31 // Resources: // ENTER_FILE_NAME: // Type:
          AWS::Serverless::Function // Properties: // Handler:
          ENTER_FILE_NAME.handler // Runtime: nodejs8.10
        </textarea>
      </pre>
      <MyDropzone />
      <input
        type="text"
        name="S3BucketName"
        placeholder="S3 Bucket Name"
        onChange={e => props.updateInfo(e)}
      />
      <button onClick={AWSDeploy()}>Deploy on AWS</button>
    </React.Fragment>
  );
};

export default AWSFunctionForm;
