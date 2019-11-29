import React from "react";
import axios from "axios";

const AWSCurrentFunctions = props => {

    // FROM TALYA TO SCOTT: THIS IS TO DO A GET REQUEST TO USER'S AWS LAMDA ACCOUNT TO GET A LIST OF ALL EXISTING FUNCTIONS ON THE ACCOUNT. THE RESULT WILL BE ENTERED INTO allFuncArray ARRAY AS DIVS AND DISPLAYED IN A SIDE PANEL
    let allFuncArray = []
    function listFunctions() {
        console.log("in listFunctions FRONT");
        axios
            .get("/aws/listFunctions", {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(console.log("back here"))
            // FROM TALYA TO SCOTT: HAVING ISSUES BELOW HERE. THE RESPONSE IS COMING FROM THE TERMINAL 'STDOUT' (IN awsController) LOOKS LIKE IT MIGHT HAVE DIFFERENT PARSING RULES. CURRENTLY RESPONSE IS NOT USER-READABLE SO IM WORKING ON PARSING THAT. WHEN I CONSOLE LOG STDOUT IN THE CONTROLLER, IT GIVES ME THE FUNCTIONS ARRAY WHICH IS WHAT I WANT. BUT WHEN IT GETS TO THE FRONT END HERE, IT LOOKS LIKE THIS {data: "", status: 200, statusText: "OK", headers: {…}, config: {…}, …} SO I CAN'T PROCESS IT YET.
            .then(response => {
                console.log("response --->", response);
                for (let i = 0; i < response.length; i++) {
                    allFuncArray.push(response[i].FunctionName)
                }
                console.log(allFuncArray)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    listFunctions()


    return (
        <React.Fragment>
            <h2>My AWS Lambda Functions</h2>
            {allFuncArray}
        </React.Fragment>
    );
};

export default AWSCurrentFunctions;
