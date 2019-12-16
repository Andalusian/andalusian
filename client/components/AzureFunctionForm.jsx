import React from 'react';
import MyDropzone from "./MyDropzone.jsx";
const axios = require('axios')
import AzureCredentials from './AzureCredentials.jsx'
import AzureCurrentFunctions from "./AzureCurrentFunctions.jsx";

const AzureFunctionForm = (props) => {
    return (
        <React.Fragment>
            <h2>Azure</h2>
            <h3>Configuration</h3>
            <AzureCredentials
                updateInfo={props.updateInfo}
                azureUser={props.azureUser}
                azurePass={props.azurePass}
                azureTenant={props.azureTenant}
                submitKey={props.submitKey} />
            <AzureCurrentFunctions azureFunctions={props.azureFunctions} />

            <hr />
            <h4>Create Function</h4>
            <div className="azureInfo">
                <input onChange={(e) => props.updateInfo(e.target.name, e.target.value)} id="azureProject" name="azureProject" type="text" placeholder="Project Name" />
                <select id="Runtime" name="azureRuntime" onChange={(e) => props.updateInfo(e.target.name, e.target.value)}>
                    <option value='1'>-- select runtime --</option>
                    <option value="--csharp --dotnet">Dotnet</option>
                    <option value="--javascript --node">Node</option>
                    <option value="--python">Python</option>
                    <option value="--powershell">Powershell</option>
                </select>
                <button className="azureButton" onClick={() => axios.post('/azure/createProj', { username: props.username, projectName: props.azureProject, runtime: props.azureRuntime })}>Create Project</button>
                <input onChange={(e) => { props.updateInfo(e.target.name, e.target.value) }} name="functionName" type="text" placeholder="Function Name" />
            </div>
            <select id="azureTemplate" name="azureTemplate" onChange={(e) => props.updateInfo(e.target.name, e.target.value)}>
                <option value='1'>-- select template --</option>
                <option value="Blob Trigger">Blob Trigger</option>
                <option value="Cosmos DB Trigger">Cosmos DB Trigger</option>
                <option value="Event Grid Trigger">Event Grid Trigger</option>
                <option value="HTTP Trigger">HTTP Trigger</option>
                <option value="Queue Trigger">Queue Trigger</option>
                <option value="SendGrid">SendGrid</option>
                <option value="Service Bus Queue Trigger">Service Bus Queue</option>
                <option value="Service Bus Topic Trigger">Service Bus Topic</option>
                <option value="Timer Trigger">Timer Trigger</option>
            </select>
            <button className="azureButton" onClick={() => axios.post('/azure/createFunc', { username: props.username, projectName: props.azureProject, functionName: props.functionName, template: props.azureTemplate })
                .then(data => {
                    props.updateInfo('uploadedFunction', data.data);
                    document.getElementById('azureCode').value = data.data;})
            }>Create Function</button>
            <pre>
                <textarea onChange={(e) => props.updateInfo('uploadedFunction', e.target.value)} id="azureCode" defaultValue={props.uploadedFunction} spellCheck="false" rows="25"></textarea>
            </pre>
            <button onClick={props.updateCode}>Save Changes</button>
            <input onChange={(e) => props.updateInfo(e.target.name, e.target.value)} name="azureApp" type="text" placeholder="App to Deploy to" />
            <button onClick={() =>
                axios.post('/azure/deployFunc', { username: props.username, projectName: props.azureProject, app: props.azureApp })}>Deploy</button>
        </React.Fragment>
    )
}

export default AzureFunctionForm;
