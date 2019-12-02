import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import axios from "axios";

const AWSFunctionForm = props => {
  function configureAWS() {
    axios
      .post("/aws/configureAWS", {
        accessKey: props.accessKey,
        secretAccessKey: props.secretAccessKey,
        region: props.region,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createFunction() {
    axios
      .post("aws/createFunction", {
        functionName: props.functionName,
        S3BucketName: props.S3BucketName
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function configureTemp() {
    axios
      .post("/aws/configureTemp", {
        functionName: props.functionName,
        codeHere: props.codeHere
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function packageSAM() {
    axios
      .post("/aws/packageSAM", {
        S3BucketName: props.S3BucketName,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function AWSDeploy() {
    axios
      .post("/aws/deploy", {
        functionName: props.functionName,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createBucket() {
    let S3BucketInput = document.getElementById("S3BucketInput");
    S3BucketInput.value = "";
    let newBucketRegion = document.getElementById("newBucketRegion");
    newBucketRegion.value = "";

    axios.post("/aws/createBucket", {
      S3BucketName: props.S3BucketName,
      newBucketRegion: props.newBucketRegion
    })
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <React.Fragment>

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
        <button onClick={() => configureAWS()}>Save Configuration</button>
      </pre>
      <input onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />

      <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
      <button onClick={() => createFunction()}>Create Function</button>
      <h4>My AWS Buckets</h4>
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
        <button onClick={() => createBucket()}>Create New S3 Bucket</button>
      </div>
      <button onClick={() => configureTemp()}>Configure Template</button>
      <button onClick={() => packageSAM()}>Package AWS SAM</button>
      <button onClick={() => AWSDeploy()}>Deploy on AWS</button>

    </React.Fragment>
  );
};

export default AWSFunctionForm;
