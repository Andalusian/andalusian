import React from 'react';

const GoogleCredentials = props => {
  return (
    <React.Fragment>
      <pre>
        <textarea name="googleKey" onChange={(e) => props.updateInfo(e.target.name, e.target.value)} placeholder="gcloud auth key" rows="10"></textarea>
      </pre>
      <button className="saveButton" onClick={() => props.submitKey('googleKey')}>Save Credentials</button>
    </React.Fragment>
  );
}

export default GoogleCredentials;