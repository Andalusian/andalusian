import React from 'react';

const Login = (props) => {
  return (
    <div id="loginContainer" className="container">
      <form id="loginForm">
        <h2>Log In</h2>
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Username"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <input
          type="password"
          name="password"
          autoComplete="password"
          placeholder="Password"
          onChange={e => props.updateInfo(e.target.name, e.target.value)}
        />
        <button onClick={props.handleLogin}>Log In</button>
        <div className="toggleSignup" onClick={props.handleToggleSignup}>
          Sign Up
        </div>
      </form>
    </div>
  );
}

export default Login;