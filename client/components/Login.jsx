import React from 'react';

const Login = (props) => {
  return (
    <div id="loginForm">
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={e => props.updateInfo(e.target.name, e.target.value)}
      />
      <button onClick={props.handleLogin}>Log In</button>
      <div className="toggleSignup" onClick={props.handleToggleSignup}>
        Sign Up
      </div>
    </div>
  );
}

export default Login;