import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import AWSCredentials from './AWSCredentials.jsx';
import AWSCurrentFunctions from './AWSCurrentFunctions.jsx';
import axios from "axios";

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
          currRegion={props.currRegion}
          functionName={props.functionName}
          codeHere={props.codeHere}
          currentBuckets={props.currentBuckets}
        />
      </div>
      <div className="mainColumn container">
        <h3>Create Function</h3>
        <input id="functionName" onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
        <input
          id="awsRole"
          type="text"
          name="awsRole"
          defaultValue=":role/"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
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

        <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} codeLoaded={props.codeLoaded} />
        <button id="createFuncBtn" onClick={() => props.createFunction()}>Create Function</button>
        <button id="updateFuncBtn" onClick={() => props.updateFunction()}>Update Function</button>
      </div>
    </div>
  );
};

export default AWSFunctionForm;