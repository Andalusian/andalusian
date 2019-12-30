import React from "react";
import axios from "axios";
import MicroList from "./MicroList.jsx";
import Login from './Login.jsx';
import Signup from "./Signup.jsx";
import Signout from "./Signout.jsx";
import AccountPage from "./AccountPage.jsx"
import GoogleFunctionForm from "./GoogleFunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import AWSFunctionInfo from "./AWSFunctionInfo.jsx";
import AzureFunctionForm from "./AzureFunctionForm.jsx";
import DockerSetup from "./DockerSetup.jsx";
import GoogleWelcomeForm from "./GoogleWelcomeForm.jsx";
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Loading from "./Loading.jsx";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // // andalusian
      username: '',
      password: '',
      keys: [],
      // // google
      googleKey: '',
      googleKeyAlias: '',
      googleAddKeyModalClicked: false,
      runtime: undefined,
      googleProject: '',
      googleFunctionButtons: [],
      googleFunctionInfoButtonClicked: false,
      googleFunctionInfo: {},
      googleFunctionNames: '',
      // // aws
      awsAccessKey: '', // once account's been configured, awsAccessKey will be saved in database and state for future  logins
      awsSecretAccessKey: '', // same as awsAccessKey
      awsKeyAlias: '', // user can save multip awsAccessKey/awsSecretAccessKey in one account and give it aliases
      codeHere: "", // user can write function code to be deployed here
      currentFunctions: [], // listFunctions() will populate this with current deployed functions along with it's associated buttons (Get Info, Load Code, Invoke, Delete)
      awsRegion: '', // used to configure account and listFunctions for a given region
      awsRuntime: '', // this info is required by AWS when deploying a function. It's entered by the user
      awsRole: '', // this info is required by AWS when deploying a function. It's entered by the user
      awsAccountID: '', // this info is required by AWS when deploying a function. It's pulled from AWS SDK
      codeLoaded: '', // loadCode() populates this field
      awsPopup: false, // when Get Info is clicked, this is set to true and a popup is displayed with all the info of a given function
      functionInvocations: [], // this is used for the graph displaying when and how many time a function was invoked
      shortCurrentFunctions: [], // similar to currentFunctions, without the buttons (used on Account Overview page)
      // S3BucketName: '',
      // newBucketRegion: "",
      // currRegion: "",
      // currentBuckets: [],
      // // docker
      dockerUsername: '',
      dockerPassword: '',
      runtimeEnv: '',
      workDir: '',
      runtimeCom: '',
      exposePort: '',
      com: '',
      copy: '',
      repository: '',
      sshKeyName: '',
      ec2User: '',
      publicDns: '',
      awsRepoUri: '',
      // // azure
      azureRuntime: '',
      azureTemplate: '',
      azureApp: '',
      azureProject: '',
      azureUser: '',
      azurePass: '',
      azureTenant: '',
      azureFunctions: [],
      azureNames: [],
      // // all
      pageSelect: '',
      functionName: '',
      uploadedFunction: '',
      operatingSystem: '',
      checkCount: 0,
      loading: false, // when loading is set to true, a gif is displayed to show user something is loading
      //Dropzone prop for file data and text
      uploadedFiles: [],
      // render states
      isLogin: false,
      isSignup: false,
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.getFuncInfo = this.getFuncInfo.bind(this);
    this.loadCode = this.loadCode.bind(this);
    this.invokeFunc = this.invokeFunc.bind(this);
    this.deleteFunc = this.deleteFunc.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleToggleSignup = this.handleToggleSignup.bind(this);
    this.handleSubmitKey = this.handleSubmitKey.bind(this);
    this.googleListFunctions = this.googleListFunctions.bind(this);
    this.listFunctions = this.listFunctions.bind(this)
    this.createFunction = this.createFunction.bind(this);
    this.configureAWS = this.configureAWS.bind(this);
    this.handleSignout = this.handleSignout.bind(this)
    this.closeFuncInfo = this.closeFuncInfo.bind(this)
    this.updateFunction = this.updateFunction.bind(this)
    this.updateCode = this.updateCode.bind(this)
    this.listAzure = this.listAzure.bind(this)
    // this.createBucket = this.createBucket.bind(this)
    // this.listBuckets = this.listBuckets.bind(this)
  }

  componentDidMount() {
    axios.get('/checkLogin')
      .then(response => this.setState(response.data))
      .catch(function (error) {
        console.error('componentDidMount error');
      });
  }

  // updateInfo is used across all microservice platforms to setState for the approptiate field, which is then used for various functions
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
      if (updateKey.length) {
        const project = JSON.parse(updateKey[0].key).project_id;
        this.setState({ googleProject: project });
        axios.post('/gcloud/auth', { user_name: this.state.username, key_file: updateKey[0].key, project })
          .then((res) => {
            if (res.status === 200) this.googleListFunctions();
          })
          .catch(function (error) {
            console.error(error);
          });
        updateObj.googleKey = updateKey[0].key;
      }
    }
    this.setState(updateObj);
  }


  handleLogin(e) {
    e.preventDefault();
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
          } else if (updateKey.keyType === 'awsSecretAccessKey') {
            updateStateObject.awsAccessKey = updateKey.awsAccessKey;
            updateStateObject.awsKeyAlias = updateKey.keyAlias;
          } else if (updateKey.keyType === 'dockerPassword') {
            updateStateObject.dockerUsername = updateKey.dockerUsername;
          } else if (updateKey.keyType === 'azurePass') {
            updateStateObject.azureUser = updateKey.azureUser;
            updateStateObject.azureTenant = updateKey.azureTenant;
          }
        });
        this.setState(updateStateObject);
        this.osChecker();
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  handleSignup(e) {
    e.preventDefault();
    axios.post('/db/createNewUser', { username: this.state.username, password: this.state.password })
      .then(() => {
        this.setState({
          isLogin: true,
          isSignup: false,
        });
        this.osChecker()
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // when user signs out, all fields within state are cleared
  handleSignout() {
    axios.post('db/deleteUserFiles', { username: this.state.username })
      .then(() => {
        this.setState({
          // andalusian
          username: '',
          password: '',
          keys: [],
          // google
          googleKey: '',
          googleKeyAlias: '',
          googleAddKeyModalClicked: false,
          runtime: undefined,
          googleProject: '',
          googleFunctionButtons: [],
          googleFunctionInfoButtonClicked: false,
          googleFunctionInfo: {},
          googleFunctionNames: '',
          // aws
          awsAccessKey: '',
          awsSecretAccessKey: '',
          awsKeyAlias: '',
          codeHere: "",
          currentFunctions: [],
          awsRegion: '',
          awsRuntime: '',
          awsRole: '',
          awsAccountID: '',
          codeLoaded: '',
          awsPopup: false,
          functionInvocations: [],
          shortCurrentFunctions: [],
          // S3BucketName: '',
          // newBucketRegion: "",
          // currRegion: "",
          // currentBuckets: [],
          // docker
          dockerUsername: '',
          dockerPassword: '',
          runtimeEnv: '',
          workDir: '',
          runtimeCom: '',
          exposePort: '',
          com: '',
          copy: '',
          repository: '',
          sshKeyName: '',
          ec2User: '',
          publicDns: '',
          awsRepoUri: '',
          //azure
          azureRuntime: '',
          azureTemplate: '',
          azureApp: '',
          azureProject: '',
          azureUser: '',
          azurePass: '',
          azureTenant: '',
          azureFunctions: [],
          azureNames: [],
          // both
          pageSelect: '',
          functionName: '',
          uploadedFunction: '',
          operatingSystem: '',
          checkCount: 0,
          loading: false,
          //Dropzone prop for file data and text
          uploadedFiles: [],
          // render states
          isLogin: false,
          isSignup: false,
        })
      })
      .catch(function (error) {
        console.error('handle sign out error');
      });
  }

  osChecker() {
    if (this.state.checkCount === 0) {
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
      this.setState({
        operatingSystem: os,
        checkCount: this.state.checkCount + 1,
      })
    }
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
      } else if (switchKey.keyType === 'azurePass') {
        document.getElementById('azureCredentials').reset();
        keyObject.azureUser = switchKey.azureUser;
        keyObject.azureTenant = switchKey.azureTenant;
      }
      this.setState(keyObject);
    } else {
      switch (keyType) {
        case 'googleKey':
          const project = JSON.parse(this.state.googleKey).project_id;
          this.setState({ googleProject: project });
          keyObject.key = this.state.googleKey;
          keyObject.keyAlias = this.state.googleKeyAlias;
          axios.post('/gcloud/auth', { user_name: this.state.username, key_file: this.state.googleKey, project })
            .then(response => {
              if (response.status === 200) {
                axios
                  .post('/db/storeKey', keyObject)
                  .then(response => this.setState({ keys: response.data.keys }))
                  .catch(function (error) {
                    console.error(error);
                  });
              }
            });
          break;
        case 'awsSecretAccessKey':
          keyObject.key = this.state.awsSecretAccessKey;
          keyObject.awsAccessKey = this.state.awsAccessKey;
          keyObject.keyAlias = this.state.awsKeyAlias;
          axios
            .post('/db/storeKey', keyObject)
            .then(response => this.setState({ keys: response.data.keys }))
            .catch(function (error) {
              console.error(error);
            });

          break;
        case 'dockerPassword':
          keyObject.key = this.state.dockerPassword;
          keyObject.dockerUsername = this.state.dockerUsername;
          axios
            .post('/db/storeKey', keyObject)
            .then(response => this.setState({ keys: response.data.keys }))
            .catch(function (error) {
              console.error(error);
            });
          break;
        case 'azurePass':
          keyObject.azureUser = this.state.azureUser;
          keyObject.key = this.state.azurePass;
          keyObject.azureTenant = this.state.azureTenant;
          axios
            .post('/db/storeKey', keyObject)
            .then(response => this.setState({ keys: response.data.keys }))
            .catch(function (error) {
              console.error(error);
            });
          break;
      }
    }
  }

  handleToggleSignup() {
    this.setState(prevState => ({
      isSignup: !prevState.isSignup
    }));
  }

  // configureAWS() will trigger a Credentials file within the username folder to be created with user's Access Key, Secret Access Key and region. Upon completion of task, listFunctions() is triggered.
  configureAWS() {
    this.setState({ loading: true })

    axios
      .post("/aws/configureAWS", {
        awsAccessKey: this.state.awsAccessKey,
        awsSecretAccessKey: this.state.awsSecretAccessKey,
        awsRegion: this.state.awsRegion,
        username: this.state.username
      })
      .then((response) => {
        setTimeout(() => this.listFunctions(), 3000);
      })
      .catch((error) => {
        console.log('configure AWS error');
      });
  }

  listAzure() {
    const azureFuncArr = [];
    const azureNameArr = [];

    axios.post('/azure/getFuncs', { projectName: this.state.azureProject })
      .then(data => {
        for (let i = 0; i < data.data.length; i += 1) {
          azureFuncArr.push(data.data[i].name);
          azureNameArr.push(data.data[i].name);
        }
        this.setState({ azureFunctions: azureFuncArr, azureNames: azureNameArr })
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to get a list of deployed functions and push them into two arrays allFuncArray and shortAllFuncArray. allFuncArray will have the function name as well as the associated buttons with them. shortAllFuncArray will only have the function names in them. Both arrays are put in state with setState.
  listFunctions() {
    let allFuncArray = [];
    let shortAllFuncArray = [];
    axios
      .post('/aws/listFunctions', {
        username: this.state.username
      })
      .then(data => {
        for (let i = 0; i < data.data.Functions.length; i++) {
          let funcName = data.data.Functions[i].FunctionName;
          allFuncArray.push(funcName); //<div className="container short function" key={i}><h4>{funcName}</h4> <button onClick={() => this.getFuncInfo(funcName)}>Get Info</button><button onClick={() => this.loadCode(funcName)}>Load Code</button><button onClick={() => this.invokeFunc(funcName)}>Invoke Function</button><button onClick={() => this.deleteFunc(funcName)}>Delete Function</button></div>
          shortAllFuncArray.push(<div className="myAWSFuncsShort" key={i}>{funcName} </div>)
        }
        this.setState({
          currentFunctions: allFuncArray,
          shortCurrentFunctions: shortAllFuncArray,
          loading: false
        });
      })
      .catch(function (error) {
        console.log('list functions error');
      });
  }

  googleListFunctions() {
    this.setState({ loading: true })

    if (!this.state.googleFunctionButtons[0]) {
      this.setState({ loading: true });
      fetch(`/gcloud/list/${this.state.username}`)
        .then(data => data.json())
        .then(data => {
          this.setState({ loading: false });
          const fnList = data.fn_list;
          const fnButtons = [<h3 className="container short">Project's Functions</h3>];
          const fnNames = [];
          fnList.forEach((el) => {
            fnNames.push(<div id={el} className="myGoogleFuncsShort">{el}</div>)
          })
          fnList.forEach((el) => {
            fnButtons.push(<div id={el} className="container short">
              <h4>{el}</h4>
              <div class="buttonContainer">
                <button id={el + "GetInfo"} onClick={() => {
                  this.setState({ loading: true });
                  fetch(`/gcloud/info/${el}/${this.state.username}`)
                    .then(data => data.json())
                    .then(data => {
                      this.setState({
                        loading: false,
                        googleFunctionInfoButtonClicked: true,
                        googleFunctionInfo: data,
                      })
                    })
                }}>Get Info</button>
                <button id={el + "InvokeFunction"} onClick={() => {
                  this.setState({ loading: true });
                  fetch(`/gcloud/call/${el}/${this.state.username}`)
                    .then(data => {
                      this.setState({ loading: false });
                      if (data.status === 200) {
                        document.getElementById(el + "InvokeFunction").style.backgroundColor = "green";
                        setTimeout(() => { document.getElementById(el + "InvokeFunction").style.backgroundColor = "#80a9b9"; }, 1000);
                      } else if (data.status === 500) {
                        document.getElementById(el + "InvokeFunction").style.backgroundColor = "red";
                        setTimeout(() => { document.getElementById(el + "InvokeFunction").style.backgroundColor = "#80a9b9"; }, 1000);
                      }
                    })
                }}>Invoke Function</button>
                <button id={el + "DeleteFunction"} onClick={() => {
                  this.setState({ loading: true });
                  fetch(`/gcloud/delete/`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fn_name: el, user_name: this.state.username }),
                  })
                    .then(data => {
                      if (data.status === 200) {
                        fetch(`/gcloud/list/${this.state.username}`)
                          .then(data => data.json())
                          .then(data => {
                            this.setState({ loading: false });
                            const fnList = data.fn_list;
                            const fnButtons = [<h3 className="container short">Project's Functions</h3>];
                            const fnNames = [];
                            fnList.forEach((el) => {
                              fnNames.push(<div id={el} className="myGoogleFuncsShort">{el}</div>)
                            })
                            fnList.forEach((el) => {
                              fnButtons.push(<div id={el} className="container short">
                                <h4>{el}</h4>
                                <div class="buttonContainer">
                                  <button id={el + "GetInfo"} onClick={() => {
                                    this.setState({ loading: true });
                                    fetch(`/gcloud/info/${el}/${this.state.username}`)
                                      .then(data => data.json())
                                      .then(data => {
                                        this.setState({
                                          loading: false,
                                          googleFunctionInfoButtonClicked: true,
                                          googleFunctionInfo: data,
                                        })
                                      })
                                  }}>Get Info</button>
                                  <button id={el + "InvokeFunction"} onClick={() => {
                                    this.setState({ loading: true });
                                    fetch(`/gcloud/call/${el}/${this.state.username}`)
                                      .then(data => {
                                        this.setState({ loading: false });
                                        if (data.status === 200) {
                                          document.getElementById(el + "InvokeFunction").style.backgroundColor = "green";
                                          setTimeout(() => { document.getElementById(el + "InvokeFunction").style.backgroundColor = "#80a9b9"; }, 1000);
                                        } else if (data.status === 500) {
                                          document.getElementById(el + "InvokeFunction").style.backgroundColor = "red";
                                          setTimeout(() => { document.getElementById(el + "InvokeFunction").style.backgroundColor = "#80a9b9"; }, 1000);
                                        }
                                      })
                                  }}>Invoke Function</button>
                                  <button id={el + "DeleteFunction"} onClick={() => {
                                    fetch(`/gcloud/delete/`, {
                                      method: 'DELETE',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({ fn_name: el, user_name: this.state.username }),
                                    })
                                      .then(data => {
                                        if (data.status === 200) {
                                          document.getElementById(el).remove();
                                        }
                                      })
                                  }}>Delete Function</button>
                                </div>
                              </div>);
                            });
                            this.setState({
                              googleFunctionButtons: fnButtons,
                              googleFunctionNames: fnNames,
                              loading: false
                            });
                          })
                          .catch(function (error) {
                            console.error(error);
                          });
                      }
                    })
                }}>Delete Function</button>
              </div>
            </div>);
          });
          this.setState({
            googleFunctionButtons: fnButtons,
            googleFunctionNames: fnNames,
            loading: false
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to retrieve the function code for a given deployed function. The retrieved code is saved in state and displayed in the textarea with the id "codeHere".
  loadCode(funcName) {
    axios
      .post("/aws/loadCode", {
        funcName,
        username: this.state.username,
      })
      .then(data => {
        this.setState({ codeLoaded: data.data });
        document.getElementById("codeHere").value = data.data
        document.getElementById("functionName").value = funcName
      })
      .catch(error => { })
  }

  updateCode() {
    axios.post('/azure/updateCode', {
      code: this.state.uploadedFunction,
      username: this.state.username,
      projectName: this.state.azureProject,
      functionName: this.state.functionName
    })
      .then(data => console.log('Updated'))
      .catch(error => console.log('updateCode error'))
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to retrieve all info on a given deployed function (runtime, status, invocations, etc.). The retrieved info is saved in state. awsPopup is set to true, which enables a popup.
  getFuncInfo(funcName) {
    let functionInvocations = [];
    axios
      .post("/aws/getFuncInfo", {
        funcName,
        username: this.state.username
      })
      .then(data => {
        if (data.data[1]) {
          for (let i = 0; i < data.data[1].logStreams.length; i++) {
            let invokeTime = (new Date(data.data[1].logStreams[i].creationTime)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            functionInvocations.push(<div key={i}>{invokeTime} </div>)
          }
        }
        this.setState({
          functionName: funcName,
          awsFuncState: data.data[0].Configuration.State,
          awsFuncRuntime: data.data[0].Configuration.Runtime,
          awsFuncLastModified: (new Date(Date.parse(data.data[0].Configuration.LastModified))).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
          awsFuncRole: data.data[0].Configuration.Role,
          awsPopup: true,
          functionInvocations: functionInvocations,
        });
      })
      .catch(function (error) {
        console.log('getFuncInfo error');
      });
  }

  // Used specifically for AWS. The function is linked to a "Close" button on the popup. When clicked, awsPopup within state is set to false and the popup is removed from screen.
  closeFuncInfo() {
    this.setState({ awsPopup: false })
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to invoke a function. No setState is triggered for this action.
  invokeFunc(funcName) {
    axios
      .post("/aws/invokeFunc", {
        funcName,
        username: this.state.username
      })
      .catch(function (error) {
        console.log('invokeFunc error');
      });
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to delete a given deployed. listFunctions is triggered to update state with current functions and display the new list on the screen.
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
        console.log('deleteFunc error');
      });
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to deploy a new function. A function name, function code, runtime, role, region and accountID are required. accountID is pulled from another AWS SDK call without the need for the user to enter it. listFunctions is triggered to update state with current functions and display the new list on the screen.
  createFunction() {
    if (this.state.functionName && this.state.uploadedFunction && this.state.awsRuntime && this.state.awsRole && this.state.awsRegion) {
      this.setState({ loading: true })

      axios
        .post("aws/createFunction", {
          functionName: this.state.functionName,
          uploadedFunction: this.state.uploadedFunction,
          awsRuntime: this.state.awsRuntime,
          awsRole: this.state.awsRole,
          awsAccountID: this.state.awsAccountID,
          username: this.state.username,
        })
        .then((response) => {
          setTimeout(() => this.listFunctions(), 3000);
        })
        .catch((error) => {
          console.log('create Function error');
        });
    } else {
      alert("Please enter Region, Function Name, Runtime, Role, and Code to create function")
    }
  }

  // Used specifically for AWS. It will do a post request using AWS SDK to update the code of an already deployed function. A function name and function code are required. listFunctions is triggered to update state with current functions and display the new list on the screen.
  updateFunction() {
    axios
      .post("aws/updateFunction", {
        functionName: document.getElementById("functionName").value,
        uploadedFunction: this.state.uploadedFunction,
        awsAccountID: this.state.awsAccountID,
        username: this.state.username,
      })
      .then((response) => {
        setTimeout(() => this.listFunctions(), 2000);
      })
      .catch((error) => {
        console.log('update Function error');
      });
  }

  render() {
    // displayed variable is used to determine which platform will be displayed.
    let displayed;
    // loadStatus variable is used to determine whether a "loading" gif will be displayed or not.
    let loadStatus;
    if (this.state.loading) loadStatus = (<Loading />)
    if (!this.state.loading) loadStatus = (<span></span>)
    // if user is logged in and no platform is selected, user will be directed to the Account Overview page.
    if ((this.state.pageSelect === '' && this.state.isLogin)) {
      displayed = (<React.Fragment>
        <AccountPage
          keys={this.state.keys.filter(key => key.keyType === 'googleKey')}
          updateInfo={this.updateInfo}
          configureAWS={this.configureAWS}
          shortCurrentFunctions={this.state.shortCurrentFunctions}
          googleFunctionNames={this.state.googleFunctionNames}
          googleListFunctions={this.googleListFunctions}
          azureNames={this.state.azureNames}
          listAzure={this.listAzure}
        />
      </React.Fragment>)
    }
    // if user is logged in and Gcloud is selected, user will be directed to the Gcloud page.
    // if there is no Gcloud configuration associated with the user account, GoogleWelcomeForm is displayed before GoogleFunction form, prompting user to configure account for Gcloud.
    else
      if ((this.state.pageSelect === 'Gcloud' && this.state.isLogin)) {
        let filteredkeys = this.state.keys.filter(key => key.keyType === 'googleKey');
        if (filteredkeys[0] === undefined) {
          displayed = (<React.Fragment>

            <GoogleWelcomeForm
              updateInfo={this.updateInfo}
              submitKey={this.handleSubmitKey}
            />
          </React.Fragment>
          )
        } else {
          displayed = <GoogleFunctionForm
            username={this.state.username}
            submitKey={this.handleSubmitKey}
            googleProject={this.state.googleProject}
            runtime={this.state.runtime}
            functionName={this.state.functionName}
            googleKey={this.state.googleKey}
            googleKeyAlias={this.state.googleKeyAlias}
            googleFunctionButtons={this.state.googleFunctionButtons}
            updateInfo={this.updateInfo}
            uploadedFunction={this.state.uploadedFunction}
            googleListFunctions={this.googleListFunctions}
            googleFunctionInfo={this.state.googleFunctionInfo}
            googleFunctionInfoButtonClicked={this.state.googleFunctionInfoButtonClicked}
            keys={this.state.keys.filter(key => key.keyType === 'googleKey')}
            googleAddKeyModalClicked={this.state.googleAddKeyModalClicked}
          />
        }
        // if user is logged in and Lambda is selected, user will be directed to the Lambda page.
        // if awsPopup is true (Get Info button is clicked) AWSFucntionInfo popup is displayed over AWSFunctionForm.
      } else if (this.state.pageSelect === 'Lambda' && this.state.isLogin && !this.state.awsPopup) {
        displayed = (<React.Fragment>
          <AWSFunctionForm id="AWSFunctionForm"
            currentFunctions={this.state.currentFunctions}
            currentFunctionFunctions={{ getFuncInfo: this.getFuncInfo, loadCode: this.loadCode, invokeFunc: this.invokeFunc, deleteFunc: this.deleteFunc }}
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
            listBuckets={this.listBuckets}
            createFunction={this.createFunction}
            configureAWS={this.configureAWS}
            createBucket={this.createBucket}
            awsKeyAlias={this.state.awsKeyAlias}
            keys={this.state.keys.filter(key => key.keyType === 'awsSecretAccessKey')}
            codeLoaded={this.state.codeLoaded}
            awsPopup={this.state.awsPopup}
            updateFunction={this.updateFunction}
          // listFunctions={this.listFunctions}
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
            listBuckets={this.listBuckets}
            createFunction={this.createFunction}
            configureAWS={this.configureAWS}
            createBucket={this.createBucket}
            awsKeyAlias={this.state.awsKeyAlias}
            keys={this.state.keys}
            keys={this.state.keys.filter(key => key.keyType === 'awsSecretAccessKey')}
            codeLoaded={this.state.codeLoaded}
            awsPopup={this.state.awsPopup}
            updateFunction={this.updateFunction}
          // listFunctions={this.listFunctions}
          />
          <AWSFunctionInfo
            closeFuncInfo={this.closeFuncInfo}
            functionName={this.state.functionName}
            awsFuncState={this.state.awsFuncState}
            awsFuncRuntime={this.state.awsFuncRuntime}
            awsFuncLastModified={this.state.awsFuncLastModified}
            awsFuncRole={this.state.awsFuncRole}
            awsRegion={this.state.awsRegion}
            awsAccountID={this.state.awsAccountID}
            functionInvocations={this.state.functionInvocations}
            codeLoaded={this.state.codeLoaded}
            graph={this.state.graph}
          />
        </React.Fragment>)
        // if user is logged in and Docker is selected, user will be directed to the Docker page.
      } else if ((this.state.pageSelect === 'Docker' && this.state.isLogin)) {
        displayed = (<DockerSetup id="DockerSetup"
          code={this.state.uploadedFunction}
          runtimeEnv={this.state.runtimeEnv}
          workDir={this.state.workDir}
          runtimeCom={this.state.runtimeCom}
          exposePort={this.state.exposePort}
          com={this.state.com}
          updateInfo={this.updateInfo}
          handleSubmitKey={this.handleSubmitKey}
          functionName={this.state.functionName}
          copy={this.state.copy}
          uploadedFiles={this.state.uploadedFiles}
          pageSelect={this.state.pageSelect}
          username={this.state.username}
          repository={this.state.repository}
          dockerUsername={this.state.dockerUsername}
          dockerPassword={this.state.dockerPassword}
          awsRepoUri={this.state.awsRepoUri}
        />)
        // if user is logged in and Azure is selected, user will be directed to the Azure page.
      } else if (this.state.pageSelect === 'Azure') {
        displayed = (<AzureFunctionForm
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
          codeHere={this.state.codeHere}
          submitKey={this.handleSubmitKey}
          uploadedFunction={this.state.uploadedFunction}
          updateCode={this.updateCode}
          azureFunctions={this.state.azureFunctions}
          listAzure={this.listAzure}
        />)
      }

    return (
      <div id="appContainer">
        {/* <Sidebar /> */}
        <Header handleSignout={this.handleSignout} isLogin={this.state.isLogin} isSignup={this.state.isSignup} />
        {!this.state.isLogin && (
          <div className="grid">
            {!this.state.isSignup ? (
              <Login
                updateInfo={this.updateInfo}
                handleLogin={this.handleLogin}
                handleToggleSignup={this.handleToggleSignup}
              />
            ) : (
                <Signup
                  updateInfo={this.updateInfo}
                  handleSignup={this.handleSignup}
                  handleToggleSignup={this.handleToggleSignup}
                />
              )
            }
          </div>
        )}

        {this.state.isLogin && (
          <div id="microGrid">
            <MicroList pageSelect={this.state.pageSelect} updateInfo={this.updateInfo} />
          </div>
        )}
        {displayed}
        {loadStatus}
      </div>
    );
  }
}

export default App;

