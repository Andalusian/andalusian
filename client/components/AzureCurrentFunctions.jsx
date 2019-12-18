import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AzureCurrentFunctions = props => {
    useEffect(() => {
        props.listAzure();
    }, [])

    return (
        <React.Fragment>
            <h3>My Azure Functions</h3>
            <div id="azureFunctions">{props.azureFunctions}</div>
        </React.Fragment>
    )
}

export default AzureCurrentFunctions;
