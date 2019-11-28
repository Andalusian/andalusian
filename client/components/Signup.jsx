import React from "react";

const Signup = props => {
  return (
    <div id="signupForm">
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
      <button onClick={props.handleSignup}>Sign Up</button>
      <div onClick={props.handleToggleSignup}>Log In Instead</div>
    </div>
  );
};

export default Signup;
