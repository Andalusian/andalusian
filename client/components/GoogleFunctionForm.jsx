import React from 'react';
import MyDropzone from "./MyDropzone.jsx";
const axios = require('axios')

const GoogleFunctionForm = (props) => {
    return (
      <React.Fragment>
        <input name="functionName" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} type="text" name="functionName" placeholder="Function Name" />
        <select onChange={(e) => props.updateInfo('runtime', e.target.value)}>
          <option value='1'>Runtime</option>
          <option value="nodejs8">Node 8</option>
          <option value="nodejs10">Node 10</option>
          <option value="python37">Python 3.7</option>
          <option value="go111">Go 1.11</option>
          <option value="go113">Go 1.13</option>
        </select>
        <pre>
          <textarea name="googleKey" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} placeholder="gcloud auth key" rows="10"></textarea>
        </pre>
        <button onClick={ () => props.submitKey('googleKey') }>Save key</button>
          <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
        <button onClick={() => axios.post('/gcloud/deploy', { functionName: props.functionName, runtime: props.runtime, fn: props.code })
            .then(response => console.log('successfully deployed'))}

        >Deploy</button>
      </React.Fragment>
    );
};

export default GoogleFunctionForm;
