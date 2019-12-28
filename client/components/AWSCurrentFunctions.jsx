import React, { useState } from "react";
// This component is displayed under AWSCredentials. Once account is configured (specifically a region has been selected), deployed functions will be displayed in this component along with "Get Info", "Load Code", "Invoke Function" and "Delete Function" buttons.
const AWSCurrentFunctions = props => {
    return (
        <React.Fragment>
            <h3 className="container short">My AWS Lambda Functions</h3>
            {props.currentFunctions.map((funcName, i) => {
                return (
                  <div className="container short" key={i}>
                    <h4>{funcName}</h4>
                    <div class="buttonContainer">
                      {/* Get Info will make AWSFucntionInfo component (a popup) display over the current page. */}
                      <button onClick={() => props.currentFunctionFunctions.getFuncInfo(funcName)}>
                        Get Info
                      </button>
                      {/* Load Code will populate the textare with the given function's code. */}
                      <button onClick={() => props.currentFunctionFunctions.loadCode(funcName)}>
                        Load Code
                      </button>
                      {/* Invoke Function will invoke the selected function on users's AWS Lambda account. */}
                      <button onClick={() => props.currentFunctionFunctions.invokeFunc(funcName)}>
                        Invoke Function
                      </button>
                      {/* Delete Function will delete the selected function from users's AWS Lambda account. */}
                      <button onClick={() => props.currentFunctionFunctions.deleteFunc(funcName)}>
                        Delete Function
                      </button>
                    </div>
                  </div>
                )
              }
            )}
        </React.Fragment>
    );
};

export default AWSCurrentFunctions;
