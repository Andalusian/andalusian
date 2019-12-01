import React from "react";
import FunctionForm from "./FunctionForm.jsx";
import AWSFunctionForm from "./AWSFunctionForm.jsx";
import MicroList from "./MicroList.jsx"

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
        runtime: undefined,
      pageSelect: 'Gcloud'
    };
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(property, value) {
    let updateObj = {};
    updateObj[property] = value;
    this.setState(updateObj, () => console.log(this.state.uploadedFunction));
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
      displayed = <AWSFunctionForm
          code={this.state.uploadedFunction}
          S3BucketName={this.state.S3BucketName}
          accessKey={this.state.accessKey}
          secretAccessKey={this.state.secretAccessKey}
          region={this.state.region}
          outputFormat={this.state.outputFormat}
          updateInfo={this.updateInfo}
      />
    }

    return (
      <div className="mainContainer">
        <h1>Shinobi</h1>
        <MicroList/>
        <div className='radio'>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Gcloud')} type="radio"
                   value="Gcloud" checked={this.state.pageSelect === 'Gcloud'}/>
            Gcloud
          </label>
          <label>
            <input onChange={() => this.updateInfo('pageSelect', 'Lambda')} type="radio"
                   value="Lambda" checked={this.state.pageSelect === 'Lambda'}/>
            Lambda
          </label>
        </div>
        {displayed}
      </div>
    );
  }
}

export default App;
