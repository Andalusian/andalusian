import React from 'react';

const GoogleCredentials = props => {
  return (
    <form id="googleCredentials">
      <button type="button" className="saveButton" onClick={() => props.updateInfo('googleAddKeyModalClicked', true)}>Add New Key</button>
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
    </form>
  );
}

export default GoogleCredentials;
