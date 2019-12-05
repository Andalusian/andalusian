import React from 'react';

const AzureCredentials = (props) => {
    return (
        <React.Fragment>
            <pre>
        <textarea name="azureKey" placeholder="azure auth information" rows="10"></textarea>
      </pre>
            <button className="saveButton">Save Credentials</button>
        </React.Fragment>
    )
}

export default AzureCredentials;
