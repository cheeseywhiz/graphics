import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import dictUpdate from './dict-update.js';

export class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.onPush = this.onPush.bind(this);
        this.onPop = this.onPop.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    onPush() {
        const stack = this.props.stack.slice(0);
        stack.push(this.props.currentFrame);
        this.onStackChange(stack);
    }

    onPop() {
        const stack = this.props.stack.slice(0);
        stack.pop(-1);
        this.onStackChange(stack);
    }

    onClear() {
        this.onStackChange([]);
    }

    onStackChange(stack) {
        const stackFrame = new THREE.Matrix4().identity();
        let frame;

        for (let i = 0; i < stack.length; i++) {
            frame = stack[i];
            stackFrame.multiplyMatrices(frame, stackFrame);
        }

        this.props.onStackChange(stack);
        this.props.onStackFrameChange(stackFrame);
    }

    render() {
        return <div>
            <input type='button' value='Push' onClick={this.onPush} />
            <input type='button' value='Pop' onClick={this.onPop} />
            <input type='button' value='Clear' onClick={this.onClear} />
        </div>
    }
}

Stack.defaultState = {
    stack: [],
    stackFrame: new THREE.Matrix4().identity(),
    currentFrame: new THREE.Matrix4().identity(),
};
Stack.defaultProps = dictUpdate({
    onStackChange: (stack) => null,
    onStackFrameChange: (frame) => null,
}, Stack.defaultState);
