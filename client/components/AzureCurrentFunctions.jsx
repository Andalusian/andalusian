import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AzureCurrentFunctions = props => {
    useEffect(() => {
        props.listAzure();
    }, [])

    return (
      <React.Fragment>
        <h3 className="container short">My Azure Functions</h3>
        {props.azureFunctions.map((funcName, i) => {
          return (
            <div className="container short" key={i}>
              <h4>{funcName}</h4>
              <div class="buttonContainer">
                <button>
                  Get Info
                </button>
                <button>
                  Start Function
                </button>
                <button>
                  Stop Function
                </button>
              </div>
            </div>
          )
        }
        )}
      </React.Fragment>
    )
}

export default AzureCurrentFunctions;