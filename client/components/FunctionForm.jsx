import React from 'react';

const FunctionForm = () => {
    return (
      <React.Fragment>
        <input
          type="text"
          name="functionName"
          placeholder="Function Name"
        />
        <pre>
          <code contenteditable spellcheck="false">bananas</code>
        </pre>
      </React.Fragment>
    );
};

export default FunctionForm;