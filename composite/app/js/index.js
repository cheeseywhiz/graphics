import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {SelectorInputGroup, } from './matrix-selector.js';
import {DefaultMatrix, } from './input-matrices.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.state = dictUpdate({
            frame: new THREE.Matrix4().identity(),
            undo: new THREE.Matrix4().identity(),
        }, SelectorInputGroup.defaultState);
    }

    onValueChange(value) {
        this.setState({value: value});
    }

    onTypeChange(type) {
        this.setState({type: type});
        this.setState(DefaultMatrix.defaultState);
    }

    onMatrixChange(matrix) {
        const undo = new THREE.Matrix4().getInverse(this.state.frame);
        const frame = new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, 0,
            matrix.xj || 0, matrix.yj || 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
        this.setState({matrix: matrix, frame: frame, undo: undo});
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
