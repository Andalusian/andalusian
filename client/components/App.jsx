<<<<<<< HEAD
import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
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
    this.setState(updateObj);
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

  // deleteBucket(bucketName) {
  //   console.log("bucketName in app ---->", bucketName)
  //   axios
  //     .put("/aws/deleteBucket", {
  //       bucketName: bucketName
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

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
            {/* <button onClick={() => this.deleteBucket(bucketName)}>Delete Bucket</button> */}
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
    console.log("this.state.S3BucketName --->", this.state.S3BucketName)

  }

  render() {
    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
        <FunctionForm code={this.state.uploadCode} />
        <h2>AWS</h2>
        <AWSCurrentFunctions id="AWSCurrentFunctions"
          currentFunctions={this.state.currentFunctions}
          currRegion={this.state.currRegion}
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
        />
      </div>
    );
  }
}

export default App;
=======
import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import AWSCurrentFunctions from "./AWSCurrentFunctions.jsx";

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
      S3BucketName: "",
      functionName: ""
      fn_name: "",
      runtime: undefined
    };
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj, () => console.log(this.state.runtime));
  }

  render() {
    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
        <FunctionForm runtime={this.state.runtime} fn_name={this.state.fn_name} uploadedKey={this.state.uploadedKey} updateInfo={this.updateInfo} code={this.state.uploadedFunction} />
        <h2>AWS</h2>
        <AWSFunctionForm
          code={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          accessKey={this.state.accessKey}
          secretAccessKey={this.state.secretAccessKey}
          region={this.state.region}
          outputFormat={this.state.outputFormat}
          updateInfo={this.updateInfo}
          functionName={this.state.functionName}
        />
        <AWSCurrentFunctions />
      </div>
    );
  }
}

export default App;
>>>>>>> 5181ee8d3bb3d18a89cd6600136ba89043a617aa
