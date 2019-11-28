import React from "react";
import MyDropzone from "./MyDropzone.jsx";

const AWSFunctionForm = props => {
  initialSetUp();

  function initialSetUp() {
    // RUN THE TWO COMMANDS BELOW IN TERMINAL
    // TO INSTALL AWS CLI
    let initialSetUpCommand1 = `curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-macos.zip" -o "awscliv2.zip"`; //
    let initialSetUpCommand2 = `unzip awscliv2.zip`; //
    let initialSetUpCommand3 = `sudo ./aws/install`;
    // TO INSTALL AWS SAM
    let initialSetUpCommand4 = `brew tap aws/tap`;
    let initialSetUpCommand5 = `brew install aws-sam-cli`;
  }

  function configure() {
    // WE NEED TO GRAB THESE FROM THE INPUT FORM
    let accessKey = props.accessKey;
    let secretAccessKey = props.secretAccessKey;
    let region = props.region;
    let outputFormat = props.outputFormat;
    // RUN THESE IN THE COMMAND LINE TO CONFIGURE AWS
    let configureCommand1 = `aws2 configure`;
    // ANSWER PROMPS USING THESE;
    let configureCommand2 = accessKey;
    let configureCommand3 = secretAccessKey;
    let configureCommand4 = region;
    let configureCommand5 = outputFormat;
  }

  function AWSDeploy() {
    let bucketName = props.S3BucketName; // WE NEED TO GRAB THIS FROM THE INPUT FORM
    // RUN THE TWO COMMANDS BELOW IN TERMINAL
    let bucketNameCommand1 = `sam package \
    --template-file template.yml \
    --output-template-file package.yml \
    --s3-bucket ${bucketName}`; //
    let bucketNameCommand2 = `sam deploy \
    --template-file package.yml \
    --stack-name my-date-time-app \
    --capabilities CAPABILITY_IAM`;
  }

  return (
    <React.Fragment>
      <h2>AWS</h2>
      <input type="text" name="functionName" placeholder="Function Name" />
      <select>
        <option value="node8">Node 8</option>
        <option value="node10">Node 10</option>
        <option value="python37">Python 3.7</option>
        <option value="go111">Go 1.11</option>
        <option value="go113">Go 1.13</option>
      </select>
      <h4>Configuration</h4>
      <input
        type="text"
        name="accessKey"
        class="coupledInputs"
        placeholder="Access key ID"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        name="secretAccessKey"
        class="coupledInputs"
        placeholder="Secret access key"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        name="region"
        class="coupledInputs"
        placeholder="Region"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        name="outputFormat"
        class="coupledInputs"
        placeholder="Output Format"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        name="fileName"
        class="coupledInputs"
        placeholder="File Name"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        name="S3BucketName"
        class="coupledInputs"
        placeholder="S3 Bucket Name"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button onClick={configure()}>Save Configuration</button>
      <h4>SAM Template</h4>
      <MyDropzone />
      <pre>
        <textarea
          id="codeHere"
          placeholder="<code here />"
          spellCheck="false"
          rows="20"
        ></textarea>
      </pre>
      <button onClick={AWSDeploy()}>Deploy on AWS</button>
    </React.Fragment>
  );
};

export default AWSFunctionForm;
