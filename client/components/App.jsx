import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import MicroList from "./MicroList.jsx"
import AWSCurrentFunctions from "./AWSCurrentFunctions.jsx";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFunction: "",
      uploadedKey: "",
      accessKey: "",
      secretAccessKey: "",
      region: "",
      outputFormat: "",
      fn_name: "",
      runtime: undefined,
      pageSelect: 'Gcloud',
      S3BucketName: "",
      functionName: "",
      currentFunctions: [],
      codeHere: "",
      currentBuckets: [],
      currRegion: "",
      newBucketRegion: ""
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.getFuncInfo = this.getFuncInfo.bind(this);
    // this.deleteBucket = this.deleteBucket.bind(this);
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

  getFuncInfo(funcName) {
    console.log("getFuncInfo")
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


  listFunctions() {
    let allFuncArray = []
    axios
      .get("/aws/listFunctions", {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(data => {
        for (let i = 0; i < data.data.Functions.length; i++) {
          let funcName = data.data.Functions[i].FunctionName;
          allFuncArray.push(<div className="myAWSFuncs" key={i}>{funcName} <button onClick={() => this.getFuncInfo(funcName)}>Get Info</button></div>)
        }
        this.setState({ currentFunctions: allFuncArray })
      })
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
    // console.log("this.state.S3BucketName --->", this.state.S3BucketName)

  }

  render() {

    let displayed;

    if (this.state.pageSelect === 'Gcloud') {
      displayed = <FunctionForm
        runtime={this.state.runtime}
        fn_name={this.state.fn_name}
        uploadedKey={this.state.uploadedKey}
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
          accessKey={this.state.accessKey}
          secretAccessKey={this.state.secretAccessKey}
          region={this.state.region}
          outputFormat={this.state.outputFormat}
          updateInfo={this.updateInfo}
          functionName={this.state.functionName}
          codeHere={this.state.codeHere}
          currentBuckets={this.state.currentBuckets}
        /></React.Fragment>)
    }

    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
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
