import React, { useState } from "react";

const AWSCurrentFunctions = props => {
    return (
        <React.Fragment>
            <h3 className="container short">My AWS Lambda Functions</h3>
            {props.currentFunctions.map((funcName, i) => {
                return (
                  <div className="container short" key={i}>
                    <h4>{funcName}</h4>
                    <div class="buttonContainer">
                      <button onClick={() => props.currentFunctionFunctions.getFuncInfo(funcName)}>
                        Get Info
                      </button>
                      <button onClick={() => props.currentFunctionFunctions.loadCode(funcName)}>
                        Load Code
                      </button>
                      <button onClick={() => props.currentFunctionFunctions.invokeFunc(funcName)}>
                        Invoke Function
                      </button>
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
