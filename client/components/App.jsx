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
      // shinobi
      username: '',
      password: '',
      // google
      googleKey: '',
      runtime: undefined,
      // aws
      awsAccessKey: '',
      awsSecretAccessKey: '',
      S3BucketName: '',
      awsRegion: '',
      awsOutputFormat: '',
      // both
      functionName: '',
      uploadedFunction: '',
      // render states
      isLogin: false,
      isSignup: false,
    };
    
    this.updateInfo = this.updateInfo.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleToggleSignup = this.handleToggleSignup.bind(this);
    this.handleSubmitKey = this.handleSubmitKey.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj);
  }

  handleLogin() {
    axios.post('/db/login', { username: this.state.username, password: this.state.password })
      .then(response => console.log(response.data.userData))
  }

  handleSignup() {
    axios.post('/db/createNewUser', { username: this.state.username, password: this.state.password })
      .then(() => {
        this.setState({ 
          isLogin: true,
          isSignup: false,
        });
      });
  }

  handleSubmitKey(keyType) {
    const keyObject = {
      username: this.state.username,
      keyType: keyType,
    }
    switch (keyType) {
      case 'googleKey':
        keyObject.key = this.state.googleKey;
        break;
      case 'awsKey':
        keyObject.key = this.state.awsSecretAccessKey;
        keyObject.awsAccessKey = this.state.awsAccessKey;
        break;
    }
    axios.post('/db/storeKey', keyObject);
    // axios.post('/db/storeKey', { username: this.state.username, key: this.state.googleKey });
  }

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
            handleSignup={this.handleSignup}
            handleToggleSignup={this.handleToggleSignup}
          />
        )}
        <FunctionForm
          updateInfo={this.updateInfo}
          submitKey={this.handleSubmitKey}
          code={this.state.uploadedFunction}
        />
        <AWSFunctionForm
          code={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          awsAccessKey={this.state.awsAccessKey}
          awsSecretAccessKey={this.state.awsSecretAccessKey}
          awsRegion={this.state.awsRegion}
          awsOutputFormat={this.state.awsOutputFormat}
          updateInfo={this.updateInfo}
        />
      </div>
    );
  }
}

export default App;
