import React from "react";

const Signup = props => {
  return (
    <div id="signupForm">
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
      <button onClick={props.handleSignup}>Sign Up</button>
      <div className="toggleSignup" onClick={props.handleToggleSignup}>
        Log In Instead
      </div>
    </div>
  );
};

export default Signup;
