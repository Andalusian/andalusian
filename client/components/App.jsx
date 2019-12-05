import React from "react";
import GoogleFunctionForm from "./GoogleFunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import MicroList from "./MicroList.jsx"
import AWSCurrentFunctions from "./AWSCurrentFunctions.jsx";
import axios from "axios";
import Login from './Login.jsx';
import Signup from "./Signup.jsx";
import DockerSetup from "./DockerSetup.jsx";
import AzureFunctionForm from "./AzureFunctionForm.jsx"

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
      // both
      pageSelect: 'Gcloud',
      functionName: '',
      uploadedFunction: '',
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
    this.listFunctions = this.listFunctions.bind(this)
    this.listBuckets = this.listBuckets.bind(this)
    this.createFunction = this.createFunction.bind(this);
    this.configureAWS = this.configureAWS.bind(this);
    this.createBucket = this.createBucket.bind(this)
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;

    if (property === 'awsKeyAlias') {
      let updateKey = this.state.keys.filter(key => key.keyAlias === value && key.keyType === 'awsSecretAccessKey');
      updateObj.awsAccessKey = updateKey[0].awsAccessKey;
      updateObj.awsSecretAccessKey = updateKey[0].key;
    }
    if (property === 'googleKeyAlias') {
      let updateKey = this.state.keys.filter(key => key.keyAlias === value && key.keyType === 'googleKey');
      updateObj.awsAccessKey = updateKey[0].awsAccessKey;
      updateObj.awsSecretAccessKey = updateKey[0].key;
    }
    this.setState(updateObj);
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

  handleSubmitKey(keyType) {
    const keyObject = {
      username: this.state.username,
      keyType: keyType,
    }
    switch (keyType) {
      case 'googleKey':
        keyObject.key = this.state.googleKey;
        keyObject.keyAlias = this.state.googleKeyAlias,
        axios.post('/gcloud/auth', { key_file: this.state.googleKey })
          .then(response => {
            if (response.status === 200) {
              axios.post('/db/storeKey', keyObject);
            }
          });
        break;
      case 'awsSecretAccessKey':
        keyObject.key = this.state.awsSecretAccessKey;
        keyObject.awsAccessKey = this.state.awsAccessKey;
        keyObject.keyAlias = this.state.awsKeyAlias;
        axios.post('/db/storeKey', keyObject);
        break;
      case 'dockerPassword':
        keyObject.key = this.state.dockerPassword;
        keyObject.dockerUsername = this.state.dockerUsername;
        axios.post('/db/storeKey', keyObject);
        break;
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
        setTimeout(() => this.listFunctions(), 4000);
        setTimeout(() => this.listBuckets(), 4000)

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
      })
      .catch(error => console.log(error))
  }

  getFuncInfo(funcName) {
    axios
      .post("/aws/getFuncInfo", {
        funcName,
        username: this.state.username
      })
      .then(data => {
        alert(`State: ${data.data.Configuration.State}
        \nRuntime: ${data.data.Configuration.Runtime}
        \nLast Modified: ${(new Date(Date.parse(data.data.Configuration.LastModified))).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
        \nRole: ${data.data.Configuration.Role}`)
      })
      .catch(function (error) {
        console.log(error);
      });
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

  listBuckets() {
    let allBuckets = [<option defaultValue={"a"}> -- select an option -- </option>]
    axios
      .post("/aws/allBuckets", { username: this.state.username })
      .then(data => {
        for (let i = 0; i < data.data.Buckets.length; i++) {
          let bucketName = data.data.Buckets[i].Name;
          allBuckets.push(<option className="myAWSBuckets" key={i} value={bucketName}>{bucketName}
          </option >)
        }
        this.setState({ currentBuckets: allBuckets })
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

    if (this.state.pageSelect === 'Gcloud') {
      displayed = <GoogleFunctionForm
        submitKey={this.handleSubmitKey}
        googleProject={this.state.googleProject}
        runtime={this.state.runtime}
        functionName={this.state.functionName}
        googleKey={this.state.googleKey}
        updateInfo={this.updateInfo}
        uploadedFunction={this.state.uploadedFunction}
        keys={this.state.keys}
      />
    } else if (this.state.pageSelect === 'Lambda') {
      displayed = (<React.Fragment>

        {/* <AWSCurrentFunctions
        id="AWSCurrentFunctions"
        currentFunctions={this.state.currentFunctions}
        currRegion={this.state.currRegion}
        functionName={this.state.functionName}
        codeHere={this.state.codeHere}
        currentBuckets={this.state.currentBuckets}
      /> */}
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
          keys={this.state.keys}
          codeLoaded={this.state.codeLoaded}
        /></React.Fragment>)
    } else if (this.state.pageSelect === 'Docker') {
      displayed = (<React.Fragment><DockerSetup id="DockerSetup"
        code={this.state.uploadedFunction}
        runtimeEnv={this.state.runtimeEnv}
        workDir={this.state.workDir}
        runtimeCom={this.state.runtimeCom}
        exposePort={this.state.exposePort}
        com={this.state.com}
        updateInfo={this.updateInfo}
        submitKey={this.submitKey}
        functionName={this.state.functionName}
        copy={this.state.copy}
        uploadedFiles={this.state.uploadedFiles}
        pageSelect={this.state.pageSelect}
      ></DockerSetup></React.Fragment>)
    } else if (this.state.pageSelect === 'Azure') {
      displayed = (<React.Fragment>
        <AzureFunctionForm
        updateInfo = {this.updateInfo}
        azureRuntime={this.state.azureRuntime}
        azureTemplate={this.state.azureTemplate}
        azureApp={this.state.azureApp}
        azureProject={this.state.azureProject}
        functionName={this.state.functionName}
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
        {/* <MicroList /> */}
        <div className='radio'>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Gcloud')} type="radio"
              value="Gcloud" checked={this.state.pageSelect === 'Gcloud'} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" />
          </label>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Lambda')} type="radio"
              value="Lambda" checked={this.state.pageSelect === 'Lambda'} />
            <img src="https://git.teknik.io/POTM/Mirror-script.module.lambdascrapers/raw/commit/25b20d0adb8afa6d29eba3a0167046cb2e21ea94/icon.png" />
          </label>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Docker')} type="radio"
              value="Docker" checked={this.state.pageSelect === 'Docker'} />
            <img src="https://cdn.iconscout.com/icon/free/png-256/docker-7-569438.png" />
          </label>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Azure')} type="radio"
                   value="Azure" checked={this.state.pageSelect === 'Azure'} />
            <img src="https://abouttmc.com/wp-content/uploads/2019/02/logo_azure.png" />
          </label>
        </div>
        {displayed}
      </div>
    );
  }
}

export default App;
