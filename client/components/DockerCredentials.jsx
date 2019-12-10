import React from 'react';
import axios from "axios";

const DockerCredentials = props => {

  function dockerLogin() {
    axios
    .post('/docker/dockerLogin', {
        keys: props.keys,
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
      <button type="button" className="saveButton" onClick={() => props.handleSubmitKey('dockerPassword', 'dockerUsername')}>Save Credentials</button>
      <button type="button" onClick={() => dockerLogin()}>Login</button>
    </React.Fragment>
  );
}

export default DockerCredentials;