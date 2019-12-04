import React from 'react';

const AWSCredentials = props => {
  return (
    <React.Fragment>
      <h5>Access Key:</h5>
      <input
        type="text"
        id="awsAccessKey"
        name="awsAccessKey"
        placeholder={props.awsAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <br />
      <h5>Secret Access Key:</h5>
      <input
        type="text"
        id="awsSecretAccessKey"
        name="awsSecretAccessKey"
        placeholder={props.awsSecretAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button className="saveButton" id="credentialsBtn" onClick={() => props.submitKey('awsSecretAccessKey')}>Save Credentials</button>
    </React.Fragment>
  );
}

export default AWSCredentials;