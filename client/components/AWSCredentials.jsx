import React from 'react';

const AWSCredentials = props => {
  return (
    <React.Fragment>
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
      <button className="saveButton" onClick={() => props.submitKey('awsSecretAccessKey')}>Save Credentials</button>
    </React.Fragment>
  );
}

export default AWSCredentials;