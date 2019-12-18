import React, { useState } from "react";

const AWSCurrentFunctions = props => {
    return (
        <React.Fragment>
            <h3 className="container short">My AWS Lambda Functions</h3>
            {props.currentFunctions.map(item => {
                return (
                  item
                )
              }
            )}
        </React.Fragment>
    );
};

export default AWSCurrentFunctions;
