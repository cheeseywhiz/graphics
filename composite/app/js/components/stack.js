import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import roundFloatStr from '../round-float-str.js';

class StaticFrame extends React.Component {
    render() {
        const elements = this.props.frame.elements.map((num) => roundFloatStr(num));
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

class FrameElement extends React.Component {
    render() {
        return <li><StaticFrame frame={this.props.frame} /></li>
    }
}

export class FrameList extends React.Component {
    render() {
        const hasChildren = this.props.children !== undefined;
        return <ul>
            {this.props.frames.map((frame, index) => <FrameElement frame={frame} key={index} />)}
            {hasChildren && <li>{this.props.children}</li>}
        </ul>
    }
}

FrameList.propTypes = {frames: PropTypes.array.isRequired};

class StackBase extends React.Component {
    render() {
        return <div>
            <b>Operation stack</b><br />
            <input type='button' value='Push' onClick={this.props.onPush} />
            <input type='button' value='Pop' onClick={this.props.onPop} />
            <input type='button' value='Clear' onClick={this.props.onClear} />
            <FrameList frames={this.props.stack.map((state) => state.frame)}>
                {this.props.children}
            </FrameList>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        stack: state.stack,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onPush: () => dispatch(actions.stackPush()),
        onPop: () => dispatch(actions.stackPop()),
        onClear: () => dispatch(actions.stackClear()),
    };
}

export const Stack = connect(mapStateToProps, mapDispatchToProps)(StackBase);
