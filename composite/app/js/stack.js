import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import dictUpdate from './dict-update.js';
import roundFloatStr from './round-float-str.js';

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
            stackFrame.multiply(frame);
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

export class StaticMatrix extends React.Component {
    render() {
        const elements = this.props.matrix.elements.map(roundFloatStr);
        return <table className='matrix'><tbody>
            <tr>
                <td>{elements[0]}</td>
                <td>{elements[4]}</td>
                <td>{elements[12]}</td>
            </tr>
            <tr>
                <td>{elements[1]}</td>
                <td>{elements[5]}</td>
                <td>{elements[13]}</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }
}

StaticMatrix.defaultProps = {matrix: new THREE.Matrix4().identity()};
