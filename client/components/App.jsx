import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";

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
        fn_name: "",
        runtime: undefined
    };
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj, () => console.log(this.state.uploadedFunction));
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
        />
      </div>
    );
  }
}

export default App;
