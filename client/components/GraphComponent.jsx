import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack } from 'victory';

const data2012 = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
];


class GraphComponent extends React.Component {
    render() {
        return (
            <div>
                <VictoryChart
                    domainPadding={1}
                    theme={VictoryTheme.material}
                >
                    <VictoryAxis
                        tickValues={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => (`$${x / 1000}k`)}
                    />

                    <VictoryBar
                        data={data2012}
                        x={"quarter"}
                        y={"earnings"}
                    />

                </VictoryChart>
            </div>
        );
    }
}

export default GraphComponent