import React from 'react';

const GoogleWelcomeForm = props => {
  return (
    <div id="googleGrid" className="grid">
      <h2 className="container">GCloud</h2>
      <div className="leftColumn">
        <div id="googleCredentialsContainer" className="container">
          <h3>Configuration</h3>
          <form id="googleCredentials">
            <pre>
              <textarea id="googleKey" name="googleKey" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} placeholder="Please add a Key File to Continue..." spellCheck="false" rows="10"></textarea>
            </pre>
            <label htmlFor="googleKeyAlias">Project Name:</label>
            <input
              type="text"
              id="googleKeyAlias"
              name="googleKeyAlias"
              placeholder="Key Alias"
              onChange={e => props.updateInfo(e.target.name, e.target.value)}
            />
            <button type="button" className="saveButton" onClick={() => props.submitKey('googleKey')}>Add New Key</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GoogleWelcomeForm;