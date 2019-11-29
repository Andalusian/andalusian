import React from "react";
import axios from 'axios';
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import Login from './Login.jsx';
import Signup from "./Signup.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFunction: "",
      uploadedKey: "",
      S3BucketName: "",
      accessKey: "",
      secretAccessKey: "",
      region: "",
      outputFormat: "",
      username: '',
      password: '',
      isLogin: false,
      isSignup: false,
    };
    
    this.updateInfo = this.updateInfo.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleToggleSignup = this.handleToggleSignup.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj, () => console.log(this.state));
  }

  handleLogin() {}

  handleSignup() {}

  handleToggleSignup() {
    this.setState(prevState => ({
      isSignup: !prevState.isSignup
    }));
  }

  render() {
    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
        {!this.state.isLogin && !this.state.isSignup && (
          <Login
            updateInfo={this.updateInfo}
            handleLogin={this.handleLogin}
            handleToggleSignup={this.handleToggleSignup}
          />
        )}
        {this.state.isSignup && (
          <Signup
            updateInfo={this.updateInfo}
            handleLogin={this.handleSignup}
            handleToggleSignup={this.handleToggleSignup}
          />
        )}
        <FunctionForm
          updateInfo={this.updateInfo}
          code={this.state.uploadedFunction}
        />
        <AWSFunctionForm
          code={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          accessKey={this.state.accessKey}
          secretAccessKey={this.state.secretAccessKey}
          region={this.state.region}
          outputFormat={this.state.outputFormat}
          fileName={this.state.fileName}
          updateInfo={this.updateInfo}
        />
      </div>
    );
  }
}

export default App;
