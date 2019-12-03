import React from 'react';

const DockerCredentials = props => {
  return (
    <React.Fragment>
      <input
        type="text"
        id="dockerUsername"
        name="dockerUsername"
        placeholder="Docker Username"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="password"
        id="dockerPassword"
        name="dockerPassword"
        placeholder="Docker Password"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button className="saveButton" onClick={() => props.submitKey('dockerPassword')}>Save Credentials</button>
    </React.Fragment>
  );
}

export default DockerCredentials;