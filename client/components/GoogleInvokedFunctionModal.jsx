import React from 'react';

const GoogleInvokedFunctionModal = (props) => {
  let information = [];
  for (let key in props.info.fn_info) {
    information.push(<div>{key}: {props.info.fn_info[key]}</div>)
  }
  return (
    <div id="googleInvokedFunctionModal">
      <button onClick={() => {
        props.updateInfo('googleFunctionInfoButtonClicked', false);
      }}>X</button>
      <h4>{props.name}</h4>
      { information }
    </div>
  )
}

export default GoogleInvokedFunctionModal;