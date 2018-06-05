import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {DefaultMatrix, } from './input-matrices.js';
import {SelectorInputGroup, } from './matrix-selector.js';
import {Stack, StaticMatrix, MatrixList, CompositeFrame, } from './stack.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onStackChange = this.onStackChange.bind(this);
        this.onStackFrameChange = this.onStackFrameChange.bind(this);
        this.onReset = this.onReset.bind(this);
        this.state = Object.assign(
            {},
            SelectorInputGroup.defaultState,
            Stack.defaultState,
        );
    }

    onValueChange(value) {
        this.setState({value});
    }

    onMatrixChange(matrix) {
        const currentFrame = new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
            matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
        this.setState({matrix, currentFrame});
    }

    onAngleChange(angle) {
        this.setState({angle});
    }

    onStackChange(stack) {
        this.setState({stack});
    }

    onStackFrameChange(stackFrame) {
        this.setState({stackFrame});
    }

    onReset() {
        const state = DefaultMatrix.defaultState;
        this.onMatrixChange(state.matrix);
        this.onAngleChange(state.angle);
    }

    render() {
        return <div>
            <SelectorInputGroup
                value={this.state.value}
                matrix={this.state.matrix}
                angle={this.state.angle}
                onValueChange={this.onValueChange}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange}
                onReset={this.onReset} />
            <Stack
                currentFrame={this.state.currentFrame}
                stack={this.state.stack}
                onStackChange={this.onStackChange}
                onStackFrameChange={this.onStackFrameChange}
                onReset={this.onReset} />
            <b>Net stack operation</b>
            <StaticMatrix matrix={this.state.stackFrame} />
            <b>Composite Frame</b>
            <CompositeFrame stackFrame={this.state.stackFrame} currentFrame={this.state.currentFrame} />
        </div>
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
