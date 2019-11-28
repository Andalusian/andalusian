import React from 'react';

const Login = (props) => {
  return (
    <div id="loginForm">
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={props.updateInfo}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={props.updateInfo}
      />
      <button onClick={ props.handleLogin }>Log In</button>
      <div onClick={ props.handleToggleSignup }>Sign Up</div>
    </div>
  );
}

export default Login;