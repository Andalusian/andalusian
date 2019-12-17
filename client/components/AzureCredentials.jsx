import React from 'react';
const axios = require('axios');

const AzureCredentials = (props) => {
    return (
        <form id="azureCredentials">
            <label >Username: </label>
            <input placeholder={props.azureUser} type="text" name="azureUser" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} />
            <label >Password: </label>
            <input placeholder={props.azurePass} type="password" name="azurePass" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} />
            <label>Tenant ID: </label>
            <input placeholder={props.azureTenant} type="text" name="azureTenant" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} />
            <div className="azureCredBtns">
                <button type="button" className="saveButton" onClick={() => {props.submitKey('azurePass')}}>Store Credentials</button>
                <button type="button" className="saveButton" onClick={() => {axios.post('/azure/auth', {username: props.username, azureUser: props.azureUser, azurePass: props.azurePass, azureTenant: props.azureTenant})}}>Log In</button>
            </div>
        </ form>
    )
}

export default AzureCredentials;
