import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadCode: '',
      S3BucketName: '',
      accessKey: '',
      secretAccessKey: '',
      region: '',
      outputFormat: '',
      fileName: '',
    };
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj);
  }

  render() {
    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
        <FunctionForm code={this.state.uploadCode} />
        <AWSFunctionForm
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
