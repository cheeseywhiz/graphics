import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {SelectorInputGroup, } from './matrix-selector.js';
import {Stack, } from './stack.js';
import dictUpdate from './dict-update.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.onStackChange = this.onStackChange.bind(this);
        this.onStackFrameChange = this.onStackFrameChange.bind(this);
        this.state = Object.assign(
            {
                undo: new THREE.Matrix4().identity(),
                compositeFrame: new THREE.Matrix4().identity(),
            },
            SelectorInputGroup.defaultState,
            Stack.defaultState,
        );
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
            .multiplyMatrices(this.state.stackFrame, currentFrame);
        this.setState({matrix, currentFrame, undo, compositeFrame});
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

    render() {
        return <div>
            <SelectorInputGroup
                value={this.state.value}
                matrix={this.state.matrix}
                angle={this.state.angle}
                onValueChange={this.onValueChange}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange} />
            <Stack
                currentFrame={this.state.currentFrame}
                stack={this.state.stack}
                onStackChange={this.onStackChange}
                onStackFrameChange={this.onStackFrameChange} />
        </div>
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();
