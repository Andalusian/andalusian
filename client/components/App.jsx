import React from "react";
import axios from "axios";
import MicroList from "./MicroList.jsx"
import Login from './Login.jsx';
import Signup from "./Signup.jsx";
import Signout from "./Signout.jsx";
import GoogleFunctionForm from "./GoogleFunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import AWSFunctionInfo from "./AWSFunctionInfo.jsx";
import AzureFunctionForm from "./AzureFunctionForm.jsx";
import DockerSetup from "./DockerSetup.jsx";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // shinobi
      username: '',
      password: '',
      keys: [],
      // google
      googleKey: '',
      googleKeyAlias: '',
      runtime: undefined,
      googleProject: '',
      // aws
      awsAccessKey: '',
      awsSecretAccessKey: '',
      awsKeyAlias: '',
      // S3BucketName: '',
      // newBucketRegion: "",
      // currRegion: "",
      // currentBuckets: [],
      codeHere: "",
      currentFunctions: [],
      awsRegion: 'us-east-1',
      awsRuntime: '',
      awsRole: '',
      awsAccountID: '',
      codeLoaded: '',
      awsPopup: false,
      functionInvocations: [],
      // docker
      dockerUsername: '',
      dockerPassword: '',
      runtimeEnv: '',
      workDir: '',
      runtimeCom: '',
      exposePort: '',
      com: '',
      copy: '',
      //azure
      azureRuntime: '',
      azureTemplate: '',
      azureApp: '',
      azureProject: '',
      azureUser: '',
      azurePass: '',
      azureTenant: '',
      // both
      pageSelect: 'Gcloud',
      functionName: '',
      uploadedFunction: '',
      operatingSystem: '',
      //Dropzone prop for file data and text
      uploadedFiles: [],
      // render states
      isLogin: false,
      isSignup: false,
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.getFuncInfo = this.getFuncInfo.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleToggleSignup = this.handleToggleSignup.bind(this);
    this.handleSubmitKey = this.handleSubmitKey.bind(this);
    // this.googleListFunctions = this.googleListFunctions.bind(this);
    this.listFunctions = this.listFunctions.bind(this)
    // this.listBuckets = this.listBuckets.bind(this)
    this.createFunction = this.createFunction.bind(this);
    this.configureAWS = this.configureAWS.bind(this);
    // this.createBucket = this.createBucket.bind(this)
    this.handleSignout = this.handleSignout.bind(this)
    this.closeFuncInfo = this.closeFuncInfo.bind(this)
  }

  componentDidMount() {
    axios.get('/checkLogin')
      .then(response => this.setState(response.data));
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;

    if (property === 'awsKeyAlias') {
      let updateKey = this.state.keys.filter(key => key.keyAlias === value && key.keyType === 'awsSecretAccessKey');
      if (updateKey.length) {
        updateObj.awsAccessKey = updateKey[0].awsAccessKey;
        updateObj.awsSecretAccessKey = updateKey[0].key;
      }
    }
    if (property === 'googleKeyAlias') {
      let updateKey = this.state.keys.filter(key => key.keyAlias === value && key.keyType === 'googleKey');
      if(updateKey.length) {
        const project = JSON.parse(updateKey[0].key).project_id;
        axios.post('/gcloud/auth', { user_name: this.state.username, key_file: updateKey[0].key, project });
        updateObj.googleKey = updateKey[0].key;
      }
    }
    this.setState(updateObj, () => console.log(this.state.azureTenant));
  }

  getawsAccountID() {
    axios
      .post("/aws/getawsAccountID", {
        username: this.state.username
      })
      .then(data => {
        this.setState({ awsAccountID: data.data.Account });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleLogin() {
    axios.post('/db/login', { username: this.state.username, password: this.state.password })
      .then(response => {
        const updateStateObject = {
          isLogin: true,
          keys: response.data.userData.keys,
        };
        response.data.userData.keys.forEach(updateKey => {
          updateStateObject[updateKey.keyType] = updateKey.key;
          if (updateKey.keyType === 'googleKey') {
            updateStateObject.googleKeyAlias = updateKey.keyAlias;
          }
          if (updateKey.keyType === 'awsSecretAccessKey') {
            updateStateObject.awsAccessKey = updateKey.awsAccessKey;
            updateStateObject.awsKeyAlias = updateKey.keyAlias;
          }
          if (updateKey.keyType === 'dockerPassword') {
            updateStateObject.dockerUsername = updateKey.dockerUsername;
          }
        });
        this.setState(updateStateObject, () => {
          console.log(this.state);
        });

      });
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

  handleSignout() {
    axios.post('db/deleteUserFiles', { username: this.state.username })
      .then(() => {
        this.setState({
          username: '',
          password: '',
          // google
          googleKey: '',
          runtime: undefined,
          googleProject: '',
          // aws
          awsAccessKey: '',
          awsSecretAccessKey: '',
          S3BucketName: '',
          newBucketRegion: "",
          currRegion: "",
          currentBuckets: [],
          codeHere: "",
          currentFunctions: [],
          awsRegion: '',
          awsRuntime: '',
          awsRole: '',
          awsAccountID: '',
          codeLoaded: '',
          awsFuncState: '',
          awsFuncRuntime: '',
          awsFuncLastModified: '',
          awsFuncRole: '',
          // docker
          dockerUsername: '',
          dockerPassword: '',
          runtimeEnv: '',
          workDir: '',
          runtimeCom: '',
          exposePort: '',
          com: '',
          copy: '',
          //azure
          azureRuntime: '',
          azureTemplate: '',
          azureApp: '',
          azureProject: '',
          azureUser: '',
          azurePass: '',
          azureTenant: '',
          // both
          pageSelect: 'Gcloud',
          functionName: '',
          uploadedFunction: '',
          uploadedFiles: [],
          operatingSystem: '',
          // render states
          isLogin: false,
          isSignup: false
        })
      });
    console.log(this.state);
    console.log("signout")
  }

  osChecker() {
  let platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }
  this.operatingSystem = os;
  console.log(this.operatingSystem)
  }

  handleSubmitKey(keyType) {
    const keyObject = {
      username: this.state.username,
      keyType: keyType,
    }

    // Check if submitted key already exists in keys array
    let filterCheck = this.state.keys.filter(key => key.key === this.state[keyType]);
    if (filterCheck.length) {
      let switchKey = filterCheck[0];
      console.log(`key already exists as ${switchKey.keyAlias}`);
      keyObject.key = switchKey.key;
      if (switchKey.keyType === 'awsSecretAccessKey') {
        document.getElementById('awsCredentials').reset();
        keyObject.awsKeyAlias = switchKey.keyAlias;
        keyObject.awsAccessKey = switchKey.awsAccessKey;
      } else if (switchKey.keyType === 'googleKey') {
        document.getElementById('googleCredentials').reset();
        keyObject.googleKeyAlias = switchKey.keyAlias;
      }
      this.setState(keyObject);
    } else {
      switch (keyType) {
        case 'googleKey':
          const project = JSON.parse(this.state.googleKey).project_id;
          keyObject.key = this.state.googleKey;
          keyObject.keyAlias = this.state.googleKeyAlias;
            axios.post('/gcloud/auth', { user_name: this.state.username, key_file: this.state.googleKey, project })
              .then(response => {
                if (response.status === 200) {
                  axios
                    .post('/db/storeKey', keyObject)
                    .then(response => this.setState({ keys: response.data.keys }));
                }
              });
          break;
        case 'awsSecretAccessKey':
          keyObject.key = this.state.awsSecretAccessKey;
          keyObject.awsAccessKey = this.state.awsAccessKey;
          keyObject.keyAlias = this.state.awsKeyAlias;
          axios
            .post('/db/storeKey', keyObject)
            .then(response => this.setState({ keys: response.data.keys }));

          break;
        case 'dockerPassword':
          keyObject.key = this.state.dockerPassword;
          keyObject.dockerUsername = this.state.dockerUsername;
          axios
            .post('/db/storeKey', keyObject)
            .then(response => this.setState({ keys: response.data.keys }));
          break;
      }
    }
  }

  handleToggleSignup() {
    this.setState(prevState => ({
      isSignup: !prevState.isSignup
    }));
  }

  configureAWS() {
    axios
      .post("/aws/configureAWS", {
        awsAccessKey: this.state.awsAccessKey,
        awsSecretAccessKey: this.state.awsSecretAccessKey,
        awsRegion: this.state.awsRegion,
        username: this.state.username
      })
      .then((response) => {
        setTimeout(() => this.listFunctions(), 2000);
        // setTimeout(() => this.listBuckets(), 4000)

      })
      .catch((error) => {
        console.log(error);

      });
  }

  listFunctions() {
    let allFuncArray = [];
    axios
      .post("/aws/listFunctions", {
        username: this.state.username
      })
      .then(data => {
        for (let i = 0; i < data.data.Functions.length; i++) {
          let funcName = data.data.Functions[i].FunctionName;
          allFuncArray.push(<div className="myAWSFuncs" key={i}>{funcName} <button onClick={() => this.getFuncInfo(funcName)}>Get Info</button><button onClick={() => this.loadCode(funcName)}>Load Code</button><button onClick={() => this.invokeFunc(funcName)}>Invoke</button><button onClick={() => this.deleteFunc(funcName)}>Delete Function</button></div>)
        }
        this.setState({ currentFunctions: allFuncArray });
        this.getawsAccountID();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadCode(funcName) {
    axios
      .post("/aws/loadCode", {
        funcName,
        username: this.state.username
      })
      .then(data => {
        this.setState({ codeLoaded: data.data });
        console.log(this.state.codeLoaded)
      })
      .catch(error => console.log(error))
  }

  getFuncInfo(funcName) {
    let functionInvocations = [];
    axios
      .post("/aws/getFuncInfo", {
        funcName,
        username: this.state.username
      })
      .then(data => {
        for (let i = 0; i < data.data[1].logStreams.length; i++) {
          let invokeTime = (new Date(data.data[1].logStreams[i].creationTime)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
          functionInvocations.push(<div key={i}>{invokeTime} </div>)
        }
        this.setState({
          functionName: funcName,
          awsFuncState: data.data[0].Configuration.State,
          awsFuncRuntime: data.data[0].Configuration.Runtime,
          awsFuncLastModified: (new Date(Date.parse(data.data[0].Configuration.LastModified))).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
          awsFuncRole: data.data[0].Configuration.Role,
          awsPopup: true,
          functionInvocations: functionInvocations
        })

        console.log(data.data[1].logStreams[0].creationTime)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  closeFuncInfo() {
    this.setState({ awsPopup: false })
  }

  invokeFunc(funcName) {
    axios
      .post("/aws/invokeFunc", {
        funcName,
        username: this.state.username
      })
      .then(data =>
        console.log(data.data))
      .catch(function (error) {
        console.log(error);
      });
    alert("Function invoked.")
  }

  deleteFunc(funcName) {
    axios
      .post("/aws/deleteFunc", {
        funcName,
        username: this.state.username
      })
      .then(data => {
        this.listFunctions()
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  createFunction() {
    if (this.state.functionName && this.state.uploadedFunction && this.state.awsRuntime && this.state.awsRole && this.state.awsRegion) {
      axios
        .post("aws/createFunction", {
          functionName: this.state.functionName,
          uploadedFunction: this.state.uploadedFunction,
          awsRuntime: this.state.awsRuntime,
          awsRole: this.state.awsRole,
          awsAccountID: this.state.awsAccountID,
          username: this.state.username
        })
        .then((response) => {
          console.log("createFunction FRONT END response --->", response);
          setTimeout(() => this.listFunctions(), 4000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please enter Region, Function Name, Runtime, Role, and Code to create function")
    }
  }

  createBucket() {
    axios.post("/aws/createBucket", {
      S3BucketName: this.state.S3BucketName,
      newBucketRegion: this.state.newBucketRegion,
      username: this.state.username
    })
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {

    let displayed;
    // this.osChecker()
    if ((this.state.pageSelect === 'Gcloud' && this.state.isLogin)) {
      displayed = <GoogleFunctionForm
        username={this.state.username}
        submitKey={this.handleSubmitKey}
        googleProject={this.state.googleProject}
        runtime={this.state.runtime}
        functionName={this.state.functionName}
        googleKey={this.state.googleKey}
        googleKeyAlias={this.state.googleKeyAlias}
        updateInfo={this.updateInfo}
        uploadedFunction={this.state.uploadedFunction}
        /*googleListFunctions={this.googleListFunctions}*/
        keys={this.state.keys.filter(key => key.keyType === 'googleKey')}
      />
    } else if (this.state.pageSelect === 'Lambda' && this.state.isLogin && !this.state.awsPopup) {
      displayed = (<React.Fragment>
        <AWSFunctionForm id="AWSFunctionForm"
          currentFunctions={this.state.currentFunctions}
          currRegion={this.state.currRegion}
          submitKey={this.handleSubmitKey}
          uploadedFunction={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          newBucketRegion={this.state.newBucketRegion}
          awsAccessKey={this.state.awsAccessKey}
          awsSecretAccessKey={this.state.awsSecretAccessKey}
          awsRegion={this.state.awsRegion}
          updateInfo={this.updateInfo}
          functionName={this.state.functionName}
          codeHere={this.state.codeHere}
          currentBuckets={this.state.currentBuckets}
          awsRuntime={this.state.awsRuntime}
          awsRole={this.state.awsRole}
          awsAccountID={this.state.awsAccountID}
          listFunctions={this.listFunctions}
          listBuckets={this.listBuckets}
          createFunction={this.createFunction}
          configureAWS={this.configureAWS}
          createBucket={this.createBucket}
          awsKeyAlias={this.state.awsKeyAlias}
          keys={this.state.keys.filter(key => key.keyType === 'awsSecretAccessKey')}
          codeLoaded={this.state.codeLoaded}
          awsPopup={this.state.awsPopup}

        /></React.Fragment>)
    } else if (this.state.pageSelect === 'Lambda' && this.state.isLogin && this.state.awsPopup) {
      displayed = (<React.Fragment>
        <AWSFunctionForm id="AWSFunctionForm"
          currentFunctions={this.state.currentFunctions}
          currRegion={this.state.currRegion}
          submitKey={this.handleSubmitKey}
          uploadedFunction={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          newBucketRegion={this.state.newBucketRegion}
          awsAccessKey={this.state.awsAccessKey}
          awsSecretAccessKey={this.state.awsSecretAccessKey}
          awsRegion={this.state.awsRegion}
          updateInfo={this.updateInfo}
          functionName={this.state.functionName}
          codeHere={this.state.codeHere}
          currentBuckets={this.state.currentBuckets}
          awsRuntime={this.state.awsRuntime}
          awsRole={this.state.awsRole}
          awsAccountID={this.state.awsAccountID}
          listFunctions={this.listFunctions}
          listBuckets={this.listBuckets}
          createFunction={this.createFunction}
          configureAWS={this.configureAWS}
          createBucket={this.createBucket}
          awsKeyAlias={this.state.awsKeyAlias}
          keys={this.state.keys.filter(key => key.keyType === 'awsSecretAccessKey')}
          codeLoaded={this.state.codeLoaded}
          awsPopup={this.state.awsPopup}
        />
        <AWSFunctionInfo closeFuncInfo={this.closeFuncInfo}
          functionName={this.state.functionName}
          awsFuncState={this.state.awsFuncState}
          awsFuncRuntime={this.state.awsFuncRuntime}
          awsFuncLastModified={this.state.awsFuncLastModified}
          awsFuncRole={this.state.awsFuncRole}
          awsRegion={this.state.awsRegion}
          awsAccountID={this.state.awsAccountID}
          functionInvocations={this.state.functionInvocations}

        />
      </React.Fragment>)
    } else if ((this.state.pageSelect === 'Docker' && this.state.isLogin)) {
      displayed = (<React.Fragment><DockerSetup id="DockerSetup"
        code={this.state.uploadedFunction}
        runtimeEnv={this.state.runtimeEnv}
        workDir={this.state.workDir}
        runtimeCom={this.state.runtimeCom}
        exposePort={this.state.exposePort}
        com={this.state.com}
        updateInfo={this.updateInfo}
        submitKey={this.handleSubmitKey}
        functionName={this.state.functionName}
        copy={this.state.copy}
        uploadedFiles={this.state.uploadedFiles}
        pageSelect={this.state.pageSelect}
        keys={this.state.keys.filter(key => key.keyType === 'dockerPassword')[0]}
      ></DockerSetup></React.Fragment>)
    } else if (this.state.pageSelect === 'Azure') {
      displayed = (<React.Fragment>
        <AzureFunctionForm
          username={this.state.username}
          updateInfo={this.updateInfo}
          azureRuntime={this.state.azureRuntime}
          azureTemplate={this.state.azureTemplate}
          azureApp={this.state.azureApp}
          azureProject={this.state.azureProject}
          functionName={this.state.functionName}
          azureUser={this.state.azureUser}
          azurePass={this.state.azurePass}
          azureTenant={this.state.azureTenant}
        />
      </React.Fragment>)
    }

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
        {this.state.isLogin && !this.state.isSignup && (
          <Signout
            handleSignout={this.handleSignout}
          />
        )}

        {this.state.isLogin && <MicroList pageSelect={this.state.pageSelect} updateInfo={this.updateInfo} />}
        {displayed}
      </div>
    );
  }
}

export default App;
