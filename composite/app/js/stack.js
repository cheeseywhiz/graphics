import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import dictUpdate from './dict-update.js';
import roundFloatStr from './round-float-str.js';

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

export class CompositeFrame extends React.Component {
    render() {
        const matrix = new THREE.Matrix4()
            .multiplyMatrices(this.props.currentFrame, this.props.stackFrame);
        return <StaticMatrix matrix={matrix} />
    }
}

CompositeFrame.defaultProps = {
    stackFrame: new THREE.Matrix4().identity(),
    currentFrame: new THREE.Matrix4().identity(),
};

class MatrixElement extends React.Component {
    render() {
        return <li><StaticMatrix matrix={this.props.matrix} /></li>
    }
}

MatrixElement.defaultProps = {matrix: new THREE.Matrix4().identity()};

export class MatrixList extends React.Component {
    render() {
        const hasChildren = this.props.children !== undefined;
        return <ul>
            {this.props.matrices.map((matrix, index) => <MatrixElement key={index} matrix={matrix} />)}
            {hasChildren && <li>{this.props.children}</li>}
        </ul>
    }
}

MatrixList.defaultProps = {matrices: []};

export class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.onPush = this.onPush.bind(this);
        this.onPop = this.onPop.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    onPush() {
        const stack = this.props.stack.slice(0);
        stack.push(new THREE.Matrix4().identity());
        this.props.onStackChange(stack);
        this.props.onReset();
    }

    onPop() {
        if (this.props.stack.length > 1) {
            const stack = this.props.stack.slice(0);
            const last = stack.pop();
            stack.pop();
            stack.push(last);
            this.props.onStackChange(stack);
        }
    }

    onClear() {
        const state = Stack.defaultState;
        this.props.onStackChange(state.stack);
    }

    render() {
        return <div>
            <b>Operation stack</b><br/>
            <input type='button' value='Push' onClick={this.onPush} />
            <input type='button' value='Pop' onClick={this.onPop} />
            <input type='button' value='Clear' onClick={this.onClear} />
            <MatrixList matrices={this.props.stack.slice(0, -1)}>
                {this.props.children}
            </MatrixList>
        </div>
    }
}

Stack.defaultState = {
    stack: [new THREE.Matrix4().identity()],
};
Stack.defaultProps = dictUpdate({
    onStackChange: (stack) => null,
    onReset: () => null,
}, Stack.defaultState);
