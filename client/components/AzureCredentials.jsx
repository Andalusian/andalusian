import React from 'react';
const axios = require('axios');

const AzureCredentials = (props) => {
    return (
        <React.Fragment>
            <input placeholder="Username" type="text" name="azureUser" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} />
            <input placeholder="Password" type="password" name="azurePass" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} />
            <button className="saveButton" onClick={() => {axios.post('/azure/auth', {azureUser: props.azureUser, azurePass: props.azurePass})}}>Submit Credentials</button>
        </React.Fragment>
    )
}

export default AzureCredentials;
