import React, { useState } from "react";

const AWSCurrentFunctions = props => {
    return (
        < React.Fragment >
            <h3>My AWS Lambda Functions</h3>
            <div id="currentFunctions">
                {props.awsCurrentFunctions}
            </div>
        </React.Fragment >
    );
};

export default AWSCurrentFunctions;
