import React from 'react';
import axios from "axios";

const DockerCredentials = props => {

  function dockerLogin() {
    axios
      .post('/docker/dockerLogin', {
        dockerUsername: props.dockerUsername,
        dockerPassword: props.dockerPassword,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <React.Fragment>
      <pre id="dockerCredentials">
        <label >Username: </label>
        <input
          type="text"
          id="dockerUsername"
          name="dockerUsername"
          // placeholder="Docker Username"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <label >Password: </label>
        <input
          type="password"
          id="dockerPassword"
          name="dockerPassword"
          // placeholder="Docker Password"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <button type="button" className="saveButton" onClick={() => props.handleSubmitKey('dockerPassword', 'dockerUsername')}>Save Credentials</button>
        <button type="button" onClick={() => dockerLogin()}>Login</button>
      </pre>
    </React.Fragment>
  );
}

export default DockerCredentials;