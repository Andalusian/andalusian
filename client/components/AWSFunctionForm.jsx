import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import AWSCredentials from './AWSCredentials.jsx';
import AWSCurrentFunctions from './AWSCurrentFunctions.jsx'
import axios from "axios";

const AWSFunctionForm = props => {

  return (
    <React.Fragment>
      <h2>AWS</h2>
      <pre >
        <h4>Configuration</h4>
        <AWSCredentials updateInfo={props.updateInfo} submitKey={props.submitKey} awsAccessKey={props.awsAccessKey} awsSecretAccessKey={props.awsSecretAccessKey} />
        <h5>Region:</h5>
        <select id="awsRegion" name="awsRegion" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
          <option defaultValue={"a"}> -- select region -- </option>
          <option value="us-east-1">US East 1</option>
          <option value="us-east-2">US East 2</option>
          <option value="us-west-1">US West 1</option>
          <option value="us-west-2">US West 2</option>
          <option value="ap-east-1">AP East 1</option>
          <option value="ap-south-1">AP South 1</option>
          <option value="ap-northeast-2">AP Northeast 1</option>
          <option value="ap-southeast-1">AP Southeast 1</option>
          <option value="ap-southeast-2">AP Southeast 1</option>
          <option value="ap-northeast-1">AP Northeast 1</option>
          <option value="ca-central-1">CA Central 1</option>
          <option value="eu-central-1">EU Central 1</option>
          <option value="eu-west-1">EU West 1</option>
          <option value="eu-west-2">EU West 2</option>
          <option value="eu-west-3">EU West 3</option>
          <option value="eu-north-1">EU North 1</option>
          <option value="me-south-1">ME South 1</option>
          <option value="sa-east-1">SA East 1</option>

        </select>
        <br />
        <button id="regionBtn" onClick={() => { props.configureAWS() }}>Save Region</button>
      </pre>
      <hr></hr>
      <AWSCurrentFunctions
        id="AWSCurrentFunctions"
        currentFunctions={props.currentFunctions}
        currRegion={props.currRegion}
        functionName={props.functionName}
        codeHere={props.codeHere}
        currentBuckets={props.currentBuckets}
      />
      <h4>Create Function</h4>
      <input id="functionName" onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
      <input
        id="awsRole"
        type="text"
        name="awsRole"
        defaultValue=":role/"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <select id="awsRuntime" name="awsRuntime" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
        <option defaultValue={"a"}> -- select runtime -- </option>
        <option value="nodejs8.10">Node 8</option>
        <option value="nodejs10.x">Node 10</option>
        <option value="java8">Java 8</option>
        <option value="python2.7">Python 2.7</option>
        <option value="python3.6">Python 3.6</option>
        <option value="python3.8">Python 3.8</option>
        <option value="go1.x">Go 1.11</option>
        <option value="dotnetcore2.1">Dotnetcore 2.1</option>
        <option value="ruby2.5">Ruby 2.5</option>
      </select>

      <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} codeLoaded={props.codeLoaded} />
      <button id="createFuncBtn" onClick={() => props.createFunction()}>Create Function</button>
      {/*<hr></hr>
       <h3>My AWS S3 Buckets</h3>
      <select id="bucketsDropdown" name="S3BucketName" onChange={e => props.updateInfo(e.target.name, e.target.value)}>
        {props.currentBuckets}
      </select>
      <div>
        <input
          id="S3BucketInput"
          type="text"
          name="S3BucketName"
          placeholder="New S3 Bucket Name"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          id="newBucketRegion"
          type="text"
          name="newBucketRegion"
          placeholder="New S3 Bucket Region"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <button id="createBucketBtn" onClick={() => props.createBucket()}>Create New S3 Bucket</button>
      </div> */}

    </React.Fragment>
  );
};

export default AWSFunctionForm;
