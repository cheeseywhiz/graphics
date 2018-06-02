import React from 'react';
import ReactDOM from 'react-dom';
import {OperationSelector, InputMatrix, } from './matrix-selector.js';
import {identityMatrix, } from './input-matrices.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.state = dictUpdate(this.defaultMatrixState(), {value: '0'});
    }

    defaultMatrixState() {
        return {
            matrix: identityMatrix(),
            angle: 0,
        };
    }

    resetMatrixState() {
        this.setState(this.defaultMatrixState());
    }

    onValueChange(value) {
        this.setState({value: value});
        this.resetMatrixState();
    }

    onMatrixChange(value, key) {
        const matrix = this.state.matrix;
        matrix[key] = value;
        this.setState({matrix: matrix});
    }

    onAngleChange(angle_degrees) {
        const angle_radians = angle_degrees * Math.PI / 180;
        const sin = Math.sin(angle_radians);
        const cos = Math.cos(angle_radians);
        this.setState({
            matrix: {
                xi: cos, yi: -sin, ox: this.state.matrix.ox,
                xj: sin, yj: cos, oy: this.state.matrix.oy,
            },
            angle: angle_degrees,
        });
    }

    render() {
        return <div>
            <OperationSelector value={this.state.value} onValueChange={this.onValueChange} />
            <InputMatrix
                value={this.state.value}
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
