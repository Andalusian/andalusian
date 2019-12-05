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
              <option key={i} value={ key.keyAlias } >{key.keyAlias}</option>
            )
          })
        }
      </select>
    </form>
  );
}

export default AWSCredentials;