import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import axios from "axios";

const AWSFunctionForm = props => {

  function configureAWS() {
    let awsAccessKey = document.getElementById("awsAccessKey");
    awsAccessKey.value = "";
    let awsSecretAccessKey = document.getElementById("awsSecretAccessKey");
    awsSecretAccessKey.value = "";
    let awsRegion = document.getElementById("awsRegion");
    awsRegion.value = "";
    if (props.awsAccessKey && props.awsSecretAccessKey && props.awsRegion) {
      axios
        .post("/aws/configureAWS", {
          awsAccessKey: props.awsAccessKey,
          awsSecretAccessKey: props.awsSecretAccessKey,
          awsRegion: props.awsRegion,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      alert("Account configured.")
      props.listFunctions();
    } else {
      alert("Please fill out all 3 fields to configure")
    }
  }

  // function createFunction() {
  //   if (props.functionName && props.uploadedFunction && props.awsRuntime && props.awsRole) {
  //     axios
  //       .post("aws/createFunction", {
  //         functionName: props.functionName,
  //         S3BucketName: props.S3BucketName,
  //         uploadedFunction: props.uploadedFunction,
  //         awsRuntime: props.awsRuntime,
  //         awsRole: props.awsRole,
  //         awsAccountID: props.awsAccountID
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //     alert("Function created.")
  //     props.listFunctions();
  //   } else {
  //     alert("Please enter Function Name, Runtime, Role, and Code to create function")
  //   }
  // }

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
          id="awsAccessKey"
          name="awsAccessKey"
          placeholder="Access key ID"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="text"
          id="awsSecretAccessKey"
          name="awsSecretAccessKey"
          placeholder="Secret access key"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="text"
          id="awsRegion"
          name="awsRegion"
          placeholder="Region"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />

        <button onClick={() => configureAWS()}>Save Configuration</button>
      </pre>
      <input onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
      <select name="awsRuntime" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
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
      <input
        type="text"
        name="awsRole"
        defaultValue=":role/"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />

      <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
      <button onClick={() => props.createFunction()}>Create Function</button>

      <h4>My AWS S3 Buckets</h4>
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

    </React.Fragment>
  );
};

export default AWSFunctionForm;
