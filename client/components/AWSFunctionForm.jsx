import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import AWSCredentials from './AWSCredentials.jsx';
import AWSCurrentFunctions from './AWSCurrentFunctions.jsx';
// This is the main AWS page component that displays all related AWS components. It also allows user to deploy new functions and update existing function code.
const AWSFunctionForm = props => {
  return (
    <div id="awsGrid" className="grid">
      <h2 className="container">AWS</h2>
      <div className="leftColumn">
        <AWSCredentials
          updateInfo={props.updateInfo}
          submitKey={props.submitKey}
          awsAccessKey={props.awsAccessKey}
          awsSecretAccessKey={props.awsSecretAccessKey}
          awsKeyAlias={props.awsKeyAlias}
          keys={props.keys}
          configureAWS={props.configureAWS}
        />
        <AWSCurrentFunctions
          id="AWSCurrentFunctions"
          currentFunctions={props.currentFunctions}
          currentFunctionFunctions={props.currentFunctionFunctions}
          currRegion={props.currRegion}
          functionName={props.functionName}
          codeHere={props.codeHere}
          currentBuckets={props.currentBuckets}
        />
      </div>
     {/* This section is where a new function  can be deployed. */}
      <div className="mainColumn container">
        <h3>Create Function</h3>
        {/* User will enter the name of the function that will be visible on AWS Lambda account into this input field. */}
        <input id="functionName" onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
        {/* User will enter AWS IAM role into this input field. */}
        <input
          id="awsRole"
          type="text"
          name="awsRole"
          defaultValue=":role/"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        {/* User will select runtime for the function here. */}
        <select id="Runtime" name="awsRuntime" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
          <option defaultValue={"a"}>select runtime</option>
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
        {/* User will enter the code of the function that will be visible on AWS Lambda account into this input field. This field is also used to display code when user clicks "Load Code", and that code can be edited here to update an already deployed function */}
        <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} codeLoaded={props.codeLoaded} />
        <button id="createFuncBtn" onClick={() => props.createFunction()}>Create Function</button>
        <button id="updateFuncBtn" onClick={() => props.updateFunction()}>Update Function</button>
      </div>
    </div>
  );
};

export default AWSFunctionForm;