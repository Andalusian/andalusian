import React from 'react';
import MyDropzone from "./MyDropzone.jsx";
const axios = require('axios')

const FunctionForm = (props) => {
    return (
      <React.Fragment>
        <input onChange={(e) => props.updateInfo('fn_name', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
        <select onChange={(e) => props.updateInfo('runtime', e.target.value)}>
            <option value='1'>Runtime</option>
          <option value="nodejs8">Node 8</option>
          <option value="nodejs10">Node 10</option>
          <option value="python37">Python 3.7</option>
          <option value="go111">Go 1.11</option>
          <option value="go113">Go 1.13</option>
        </select>
        <pre>
          <textarea onChange={(e) => props.updateInfo('uploadedKey', e.target.value)} placeholder="config" rows="10"></textarea>
        </pre>
          <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
        <button onClick={() => axios.post('/gcloud/auth', {key_file: props.uploadedKey})
            .then(response => {if (response.status === 200) axios.post('/gcloud/deploy', {fn_name: props.fn_name, runtime: props.runtime, fn: props.code})})
            .then(response => console.log('successfully deployed'))}

        >Deploy</button>
      </React.Fragment>
    );
};

export default FunctionForm;
