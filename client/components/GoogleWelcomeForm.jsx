import React from 'react';

const GoogleWelcomeForm = props => {
  return (
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
  )
}

export default GoogleWelcomeForm;