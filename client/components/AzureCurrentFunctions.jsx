import React from 'react';
import axios from 'axios';

const AzureCurrentFunctions = props => {
    return (
        <React.Fragment>
            <h3>My Azure Functions</h3>
            <div id="azureFunctions">{props.azureFunctions}</div>
        </React.Fragment>
    )
}

export default AzureCurrentFunctions;
