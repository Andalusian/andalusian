import React, { useState } from "react";
import axios from "axios";

const AWSCurrentFunctions = props => {
    return (
        < React.Fragment >
            <h3>My AWS Lambda Functions</h3>
            <div id="currentFunctions">
                {props.currentFunctions}
            </div>
        </React.Fragment >
    );
};

export default AWSCurrentFunctions;
