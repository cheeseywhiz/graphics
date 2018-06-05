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
        this.onFrameChange = this.onFrameChange.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
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
        this.setState({matrix});
    }

    onFrameChange(currentFrame) {
        this.setState({currentFrame});
    }

    onNumberChange(number) {
        this.setState({number});
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
        this.onNumberChange(state.number);
        this.onFrameChange(new THREE.Matrix4().identity());
    }

    render() {
        return <div>
            <Stack
                currentFrame={this.state.currentFrame}
                stack={this.state.stack}
                onStackChange={this.onStackChange}
                onStackFrameChange={this.onStackFrameChange}
                onReset={this.onReset}>
                <SelectorInputGroup
                    value={this.state.value}
                    matrix={this.state.matrix}
                    number={this.state.number}
                    onValueChange={this.onValueChange}
                    onMatrixChange={this.onMatrixChange}
                    onNumberChange={this.onNumberChange}
                    onFrameChange={this.onFrameChange}
                    onReset={this.onReset} />
            </Stack>
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
