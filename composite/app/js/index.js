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
        this.onReset = this.onReset.bind(this);
        this.identity = new THREE.Matrix4().identity();
        this.state = Object.assign(
            {
                intermediates: [new THREE.Matrix4().identity()],
            },
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
        const stack = this.state.stack.slice(0);
        stack[stack.length - 1] = currentFrame;
        this.onStackChange(stack);
    }

    onNumberChange(number) {
        this.setState({number});
    }

    onStackChange(stack) {
        const intermediates = [new THREE.Matrix4().identity()];
        let next;

        for (let frame of stack) {
            if (!(frame.equals(this.identity))) {
                next = intermediates[intermediates.length - 1].clone();
                next.multiplyMatrices(frame, next);
                intermediates.push(next);
            }
        }

        this.setState({stack, intermediates});
    }

    onReset() {
        console.log('onReset');
        const state = DefaultMatrix.defaultState;
        this.onMatrixChange(state.matrix);
        this.onNumberChange(state.number);
        // TODO: Update intermediates on reset
    }

    render() {
        return <div>
            <Stack
                stack={this.state.stack}
                onStackChange={this.onStackChange}
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
            <b>Intermediate frames</b>
            <MatrixList matrices={this.state.intermediates} />
        </div>
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
