import React, { useState } from "react";
import axios from "axios";

const AWSCurrentFunctions = props => {
    // THIS IS TO DO A GET REQUEST TO USER'S AWS LAMDA ACCOUNT TO GET A LIST OF ALL EXISTING FUNCTIONS ON THE ACCOUNT. THE RESULT WILL BE ENTERED INTO allFuncArray ARRAY AS DIVS AND DISPLAYED IN A SIDE PANEL
    return (
        < React.Fragment >
            <h2>AWS</h2>
            {/* <h3>My Current Region:</h3>
            {props.currRegion} */}
            <h3>My AWS Lambda Functions</h3>
            <div id="currentFunctions">
                {props.currentFunctions}
            </div>
        </React.Fragment >
    );
};

export default AWSCurrentFunctions;
