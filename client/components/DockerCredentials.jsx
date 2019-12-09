import React from 'react';
import { exec } from 'child_process';

const DockerCredentials = props => {

  function dockerLogin() {
    // exec('docker login; '
  }
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
      <button type="button" className="saveButton" onClick={() => props.submitKey('dockerPassword')}>Save Credentials</button>
      {/* <button type="button" className="loginButton" onClick={() => dockerLogin()}>Login</button> */}
    </React.Fragment>
  );
}

export default DockerCredentials;