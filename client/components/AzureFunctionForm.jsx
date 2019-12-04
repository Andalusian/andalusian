import React from 'react';
import MyDropzone from "./MyDropzone.jsx";
const axios = require('axios')
import AzureCredentials from './AzureCredentials.jsx'

const AzureFunctionForm = (props) => {
    return (
        <React.Fragment>
            <h2>Azure</h2>
            <AzureCredentials/>
            <div className="azureInfo">
                <input id="azureProject" name="azureProject" type="text" placeholder="Project Name" />
                <input name="functionName" type="text" placeholder="Function Name" />
                <select name="azureRuntime" onChange={(e) => props.updateInfo(e.target.name, e.target.value)}>
                <option value='1'>Runtime</option>
                <option value="--csharp--dotnet">Dotnet</option>
                <option value="--javascript--node">Node</option>
                <option value="--python">Python</option>
                <option value="--powershell">Powershell</option>
            </select>
            </div>
            <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
            <button onClick={() => axios.post('/azure/deploy', {functionName: props.functionName, runtime: props.runtime})
                .then(response => console.log('successfully deployed'))}
            >Deploy</button>
        </React.Fragment>
    )
}

export default AzureFunctionForm;
