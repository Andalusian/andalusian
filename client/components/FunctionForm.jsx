import React from 'react';
import MyDropzone from "./MyDropzone.jsx";

const FunctionForm = (props) => {
    return (
      <React.Fragment>
        <input type="text" name="functionName" placeholder="Function Name" />
        <select>
          <option value="node8">Node 8</option>
          <option value="node10">Node 10</option>
          <option value="python37">Python 3.7</option>
          <option value="go111">Go 1.11</option>
          <option value="go113">Go 1.13</option>
        </select>
        {/* <pre>
          <textarea
            placeholder="config"
            spellCheck="false"
            rows="10"
          ></textarea>
        </pre> */}
        <pre>
          <textarea
            placeholder="config"
            spellCheck="false"
            rows="10"
          ></textarea>
        </pre>
        <MyDropzone />
        <pre>
          <textarea
            id="codeHere"
            placeholder="<code here />"
            spellCheck="false"
            rows="25"
          ></textarea>
        </pre>
        <button>Deploy</button>
      </React.Fragment>
    );
};

export default FunctionForm;
