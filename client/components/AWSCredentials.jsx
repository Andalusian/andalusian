import React from 'react';

const AWSCredentials = props => {
  return (
    <React.Fragment>
      <input
        type="text"
        id="awsAccessKey"
        name="awsAccessKey"
        placeholder={props.awsAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="text"
        id="awsSecretAccessKey"
        name="awsSecretAccessKey"
        placeholder={props.awsSecretAccessKey}
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button className="saveButton" onClick={() => props.submitKey('awsSecretAccessKey')}>Save Credentials</button>
    </React.Fragment>
  );
}

export default AWSCredentials;