import React from 'react';

const AWSCredentials = (props) => {
  return (
    <form id="awsCredentials">
      <label htmlFor="awsAccessKey">Access Key:</label>
      <input
        type="text"
        id="awsAccessKey"
        name="awsAccessKey"
        placeholder={props.awsAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <label htmlFor="awsSecretAccessKey">Secret Access Key:</label>
      <input
        type="text"
        id="awsSecretAccessKey"
        name="awsSecretAccessKey"
        placeholder={props.awsSecretAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <label htmlFor="awsKeyAlias">Key Alias:</label>
      <input
        type="text"
        id="awsKeyAlias"
        name="awsKeyAlias"
        placeholder={props.awsKeyAlias}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button type="button" className="saveButton" id="credentialsBtn" onClick={() => props.submitKey('awsSecretAccessKey')}>Add New Key</button>
      <select className="keySelection" name="awsKeyAlias" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
        <option defaultValue=''> -- select key -- </option>
        {
          props.keys.map((key, i) => {
            return (
              <option key={i} value={key.keyAlias} >{key.keyAlias}</option>
            )
          })
        }
      </select>
      <button type="button" id="regionBtn" onClick={() => { props.configureAWS() }}>Save Config</button>
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
    </form>
  );
}

export default AWSCredentials;
