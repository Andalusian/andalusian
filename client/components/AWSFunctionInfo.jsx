import React from 'react';

const AWSFunctionInfo = (props) => {
    return (
        <div id="AWSFunctionInfo">
            <h3>Function Info</h3>
            <div id="AWSFunctionInfoGrid">
                <h4 className="funcInfoH4">Function Name:</h4> <p className="funcInfoP">{props.functionName}</p>
                <h4 className="funcInfoH4">State:</h4> <p className="funcInfoP">{props.awsFuncState}</p>
                <h4 className="funcInfoH4">Runtime:</h4> <p className="funcInfoP">{props.awsFuncRuntime}</p>
                <h4 className="funcInfoH4">Last Modified:</h4> <p className="funcInfoP">{props.awsFuncLastModified}</p>
                <h4 className="funcInfoH4">Role:</h4> <p className="funcInfoP">{props.awsFuncRole}</p>
                <h4 className="funcInfoH4">ARN:</h4> <p className="funcInfoP">arn:aws:lambda:{props.awsRegion}:{props.awsAccountID}:function:{props.functionName}</p>
            </div>
            <h3>Function Invocations</h3>
            {props.functionInvocations}
            <button onClick={() => props.closeFuncInfo()}>Close Window</button>
        </div>
    )
}

export default AWSFunctionInfo;
