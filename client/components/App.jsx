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
                Bananas
                <FunctionForm />
            </div>
        );
    }
}

export default App;
