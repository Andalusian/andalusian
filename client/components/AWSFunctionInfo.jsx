import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryLabel } from 'victory'; // npm i victory

const AWSFunctionInfo = (props) => {

    let invokeObj = {};
    for (let i = 0; i < props.functionInvocations.length; i++) {
        let dates = props.functionInvocations[i].props.children[0].split(",")[0];
        if (invokeObj[dates] === undefined) {
            invokeObj[dates] = 1;
        } else {
            invokeObj[dates]++;
        }
    }
    const invocationData = [];
    const keys = Object.keys(invokeObj);
    const values = Object.values(invokeObj);
    for (let i = 0; i < keys.length; i++) {
        const tempObj = {};
        tempObj.date = keys[i];
        tempObj.invocations = values[i]
        invocationData.push(tempObj);
    }

    return (
        <div id="AWSFunctionInfo">
            <button onClick={() => props.closeFuncInfo()}>Close Window</button>

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
            <div id="invocationList">
                {props.functionInvocations}
            </div>
            <div id="graph">
                <VictoryChart
                    domainPadding={10}
                    theme={VictoryTheme.material}
                    animate={{
                        duration: 2000,
                        onLoad: { duration: 1000 }
                    }}
                >
                    <VictoryAxis
                        tickValues={keys}
                    />
                    <VictoryAxis
                        dependentAxis
                    />
                    <VictoryStack
                        colorScale={"warm"}
                    >
                        <VictoryBar
                            data={invocationData}
                            x={"date"}
                            y={"invocations"}
                            alignment="start"
                            style={{ data: { fill: "#83dc6d" } }}
                            barRatio={0.8}
                            barWidth={({ index }) => index * 2 + 8}

                        />
                    </VictoryStack>
                </VictoryChart>
            </div>
        </div>
    )
}

export default AWSFunctionInfo;
