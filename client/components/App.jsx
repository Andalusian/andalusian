import React from 'react';

import FunctionForm from './FunctionForm.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFunction: "",
            uploadedKey: ""
        };
        this.writeFunction = this.writeFunction.bind(this);
    }

    writeFunction(val) {
        this.setState({uploadedFunction: val})
    }

    render() {
        return (
            <div className="mainContainer">
                <h1>Shinobi</h1>
                <FunctionForm writeFunction={this.writeFunction} code={this.state.uploadedFunction} />
            </div>
        );
    }
}

export default App;
