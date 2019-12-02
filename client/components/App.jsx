import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import MicroList from "./MicroList.jsx"
import AWSCurrentFunctions from "./AWSCurrentFunctions.jsx";
import axios from "axios";
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
      newBucketRegion: "",
      currRegion: "",
      currentBuckets: [],
      codeHere: "",
      currentFunctions: [],
      awsSecretAccessKey: '',
      S3BucketName: '',
      awsRegion: '',
      awsOutputFormat: '',
      // both
      pageSelect: 'Gcloud',
      functionName: '',
      uploadedFunction: '',
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
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj, () => console.log(this.state.uploadedFunction));
  }


  getCurrRegion() {
    axios
      .get("/aws/getCurrRegion", {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(data => {
        this.setState({ currRegion: data.data })
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  handleLogin() {
    axios.post('/db/getUserInfo', { username: this.state.username, password: this.state.password })
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
    // const keyObject = {
    //   username: this.state.username,
    //   keyType: keyType,
    // }
    // switch (keyType) {
    //   case googleKey:
    //     keyObject.key = this.state.googleKey;
    //     break;
    //   case awsKey:
    //     keyObject.key = this.state.awsSecretAccessKey;
    //     keyObject.awsAccessKey = this.state.awsAccessKey;
    //     break;
    // }
    // axios.post('/db/storeKey', keyObject);
    axios.post('/db/storeKey', { username: this.state.username, key: this.state.googleKey });
  }

  handleToggleSignup() {
    this.setState(prevState => ({
      isSignup: !prevState.isSignup
    }));
  }

  listFunctions() {
    let allFuncArray = []
    axios
      .get("/aws/listFunctions", {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(data => {
        for (let i = 0; i < data.data.Functions.length; i++) {
          let funcName = data.data.Functions[i].FunctionName;
          allFuncArray.push(<div className="myAWSFuncs" key={i}>{funcName} <button onClick={() => this.getFuncInfo(funcName)}>Get Info</button><button onClick={() => this.deleteFunc(funcName)}>Delete Function</button></div>)
        }
        this.setState({ currentFunctions: allFuncArray })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getFuncInfo(funcName) {
    axios
      .post("/aws/getFuncInfo", {
        funcName
      })
      .then(data =>
        console.log(data.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteFunc(funcName) {
    axios
      .post("/aws/deleteFunc", {
        funcName
      })
      .then(data =>
        console.log(data.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  listBuckets() {
    let allBuckets = [<option disabled selected value key={"a"}> -- select an option -- </option>]
    axios
      .get("/aws/allBuckets", {
        headers: { 'Content-Type': 'application/json' }
      })
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


  componentWillMount() {
    this.listFunctions();
    this.listBuckets();
    this.getCurrRegion();
  }
  componentDidUpdate() {

  }

  render() {

    let displayed;

    if (this.state.pageSelect === 'Gcloud') {
      displayed = <FunctionForm
        submitKey={this.handleSubmitKey}
        runtime={this.state.runtime}
        functionName={this.state.functionName}
        googleKey={this.state.googleKey}
        updateInfo={this.updateInfo}
        code={this.state.uploadedFunction} />
    } else if (this.state.pageSelect === 'Lambda') {
      displayed = (<React.Fragment><AWSCurrentFunctions
        id="AWSCurrentFunctions"
        currentFunctions={this.state.currentFunctions}
        currRegion={this.state.currRegion}
        functionName={this.state.functionName}
        codeHere={this.state.codeHere}
        currentBuckets={this.state.currentBuckets}
      />
        <AWSFunctionForm id="AWSFunctionForm"
          code={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          newBucketRegion={this.state.newBucketRegion}
          awsAccessKey={this.state.awsAccessKey}
          awsSecretAccessKey={this.state.awsSecretAccessKey}
          awsRegion={this.state.awsRegion}
          awsOutputFormat={this.state.awsOutputFormat}
          updateInfo={this.updateInfo}
          functionName={this.state.functionName}
          codeHere={this.state.codeHere}
          currentBuckets={this.state.currentBuckets}
        /></React.Fragment>)
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
        <MicroList />
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
        </div>
        {displayed}
      </div>
    );
  }
}

export default App;
