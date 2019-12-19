import React from 'react';
import MyDropzone from "./MyDropzone.jsx";
import GoogleCredentials from "./GoogleCredentials.jsx";
import GoogleInvokedFunctionModal from './GoogleInvokedFunctionModal.jsx';
const axios = require('axios');

const GoogleFunctionForm = (props) => {
  return (
    <div id="googleGrid" className="grid">
      <h2 className="container">GCloud</h2>
      <div className="leftColumn">
        <GoogleCredentials
          updateInfo={props.updateInfo}
          googleKey={props.googleKey}
          googleKeyAlias={props.googleKeyAlias}
          submitKey={props.submitKey}
          keys={props.keys}
          googleAddKeyModalClicked={props.googleAddKeyModalClicked}
        />
        <div id="googleFunctions">
          {props.googleFunctionButtons}
          {props.googleFunctionInfoButtonClicked ? <GoogleInvokedFunctionModal info={props.googleFunctionInfo} name={props.googleFunctionInfo.name} updateInfo={props.updateInfo} /> : <React.Fragment />}
        </div>
      </div>
      { 
        props.googleProject !== "" && (<div className="mainColumn container">
            <div className="googleInfo">
              <h3>Create Function</h3>
              <input id="functionName" name="functionName" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} type="text" placeholder="Function Name" />
              <select id="Runtime" onChange={(e) => props.updateInfo('runtime', e.target.value)}>
                <option value='1'>Runtime</option>
                <option value="nodejs8">Node 8</option>
                <option value="nodejs10">Node 10</option>
                <option value="python37">Python 3.7</option>
                <option value="go111">Go 1.11</option>
                <option value="go113">Go 1.13</option>
              </select>
            </div>
            <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
            <button onClick={() => {
              props.updateInfo('loading', true);
              axios.post('/gcloud/deploy', { user_name: props.username, project: props.googleProject, fn_name: props.functionName, runtime: props.runtime, fn: props.uploadedFunction })
                .then(response => {
                  props.updateInfo('loading', false);
                  console.log('successfully deployed');
                })
            }} >Deploy</button>
          </div>)
      }
    </div>
  );
};

export default GoogleFunctionForm;
