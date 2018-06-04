import React from 'react';
import ReactDOM from 'react-dom';
import {SelectorInputGroup, } from './matrix-selector.js';
import {DefaultMatrix, } from './input-matrices.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.state = Object.assign({}, SelectorInputGroup.defaultState);
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
        return <SelectorInputGroup
                value={this.state.value}
                matrix={this.state.matrix}
                angle={this.state.angle}
                type={this.state.type}
                onValueChange={this.onValueChange}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange}
                onTypeChange={this.onTypeChange} />
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
