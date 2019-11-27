import React from 'react';

import FunctionForm from './FunctionForm.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadCode: ""
        };
    }

    render() {
        return (
            <div className="mainContainer">
                <h1>Shinobi</h1>
                <FunctionForm code={this.state.uploadCode} />
            </div>
        );
    }
}

export default App;
