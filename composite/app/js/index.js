import React from 'react';
import ReactDOM from 'react-dom';
import {OperationSelector, InputMatrix, } from './matrix-selector.js';
import {identityMatrix, DefaultMatrix, } from './input-matrices.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.state = Object.assign(
            {},
            OperationSelector.defaultState,
            InputMatrix.defaultState,
        );
    }

    onValueChange(value) {
        this.setState({value: value});
    }

    onTypeChange(type) {
        this.setState({type: type});
        this.setState(DefaultMatrix.defaultState);
    }

    onMatrixChange(matrix) {
        this.setState({matrix: matrix});
    }

    onAngleChange(angle) {
        this.setState({angle: angle});
    }

    render() {
        return <div>
            <OperationSelector
                value={this.state.value}
                onValueChange={this.onValueChange}
                onTypeChange={this.onTypeChange} />
            <InputMatrix
                type={this.state.type}
                matrix={this.state.matrix}
                angle={this.state.angle}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange} />
        </div>
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
