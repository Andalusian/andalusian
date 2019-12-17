import React from 'react';

const GoogleCredentials = props => {
  return (
    <div id="googleCredentialsContainer" className="container">
      <h3>Configuration</h3>
      <form id="googleCredentials">
        { !props.googleAddKeyModalClicked ? (<div>
          <select className="keySelection" name="googleKeyAlias" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
            <option defaultValue=''> -- select project -- </option>
            {
              props.keys.map((key, i) => {
                return (
                  <option key={i} value={key.keyAlias} >{key.keyAlias}</option>
                )
              })
            }
          </select>
          <button type="button" className="saveButton" onClick={() => props.updateInfo('googleAddKeyModalClicked', true)}>Add New Key</button>
        </div>) : (<div>
          <button onClick={() => {
            props.updateInfo('googleAddKeyModalClicked', false);
          }}>Back</button>
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
          <button type="button" className="saveButton" onClick={() => props.submitKey('googleKey')}>Add Key</button>
        </div>)}
      </form>
    </div>
  );
}

export default GoogleCredentials;
