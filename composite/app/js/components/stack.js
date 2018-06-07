import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import roundFloatStr from '../round-float-str.js';

class StaticMatrix extends React.Component {
    render() {
        return <table className='matrix'><tbody>
            <tr>
                <td>{roundFloatStr(this.props.matrix.xi)}</td>
                <td>{roundFloatStr(this.props.matrix.yi)}</td>
                <td>{roundFloatStr(this.props.matrix.ox)}</td>
            </tr>
            <tr>
                <td>{roundFloatStr(this.props.matrix.xj)}</td>
                <td>{roundFloatStr(this.props.matrix.yj)}</td>
                <td>{roundFloatStr(this.props.matrix.oy)}</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }
}

class MatrixElement extends React.Component {
    render() {
        return <li><StaticMatrix matrix={this.props.matrix} /></li>
    }
}

class MatrixList extends React.Component {
    render() {
        return <ul>
            {this.props.matrices.map((matrix, index) => <MatrixElement matrix={matrix} key={index} />)}
        </ul>
    }
}

class StackBase extends React.Component {
    render() {
        return <div>
            <input type='button' value='Push' onClick={this.props.onClick} />
            <MatrixList matrices={this.props.stack} />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        stack: state.matrix.stack,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onClick: () => dispatch(actions.stackPush()),
    };
}

export const Stack = connect(mapStateToProps, mapDispatchToProps)(StackBase);
