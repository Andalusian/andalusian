import React from "react";

const Signup = props => {
  return (
    <div id="signupContainer" className="container">
      <form id="signupForm">
        <h2>Sign Up</h2>
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
        <button onClick={props.handleSignup}>Sign Up</button>
        <div className="toggleSignup" onClick={props.handleToggleSignup}>
          Log In
        </div>
      </form>
    </div>
  );
};

export default Signup;