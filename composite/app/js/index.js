import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {SelectorInputGroup, } from './matrix-selector.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onPush = this.onPush.bind(this);
        this.onPop = this.onPop.bind(this);
        this.onClear = this.onClear.bind(this);
        this.state = dictUpdate({
            currentFrame: new THREE.Matrix4().identity(),
            undo: new THREE.Matrix4().identity(),
            stack: [],
            stackFrame: new THREE.Matrix4().identity(),
            compositeFrame: new THREE.Matrix4().identity(),
        }, SelectorInputGroup.defaultState);
    }

    onValueChange(value) {
        this.setState({value});
    }

    onMatrixChange(matrix) {
        const currentFrame = new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, 0,
            matrix.xj || 0, matrix.yj || 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
        const undo = new THREE.Matrix4().getInverse(this.state.compositeFrame);
        const compositeFrame = new THREE.Matrix4()
            .multiplyMatrices(this.state.stackFrame, this.state.currentFrame);
        this.setState({matrix, currentFrame, undo, compositeFrame});
    }

    onAngleChange(angle) {
        this.setState({angle});
    }

    onPush() {
        const stack = this.state.stack.slice(0);
        stack.push(this.state.currentFrame);
        this.updateStack(stack);
    }

    onPop() {
        const stack = this.state.stack.slice(0);
        stack.pop(-1);
        this.updateStack(stack);
    }

    onClear() {
        this.updateStack([]);
    }

    updateStack(stack) {
        const stackFrame = new THREE.Matrix4().identity();
        let frame;

        for (let i = 0; i < stack.length; i++) {
            frame = stack[i];
            stackFrame.multiplyMatrices(frame, stackFrame);
        }

        this.setState({stack, stackFrame});
    }

    render() {
        return <div>
            <SelectorInputGroup
                value={this.state.value}
                matrix={this.state.matrix}
                angle={this.state.angle}
                onValueChange={this.onValueChange}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange} />
            <input type='button' value='Push' onClick={this.onPush} />
            <input type='button' value='Pop' onClick={this.onPop} />
            <input type='button' value='Clear' onClick={this.onClear} />
        </div>
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
