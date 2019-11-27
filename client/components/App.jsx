import React from 'react';

import FunctionForm from './FunctionForm.jsx'

class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="mainContainer">
                <h1>Shinobi</h1>
                <FunctionForm />
            </div>
        );
    }
}

export default App;
