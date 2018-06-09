import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import roundFloatStr from '../round-float-str.js';

function StaticFrame({frame}) {
    const elements = frame.elements.map((num) => roundFloatStr(num));
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

export function FrameList({frames, children}) {
    const elements = frames.map((frame, index) => <StaticFrame key={index} frame={frame} />)
    if (children) elements.push(children);
    return <ul>
        {elements.map((element, index) => <li key={index}>{element}</li>)}
    </ul>
}

FrameList.propTypes = {frames: PropTypes.array.isRequired};

function StackBase({onPush, onPop, onClear, stack, children}) {
    return <div>
        <b>Operation stack</b><br />
        <input type='button' value='Push' onClick={onPush} />
        <input type='button' value='Pop' onClick={onPop} />
        <input type='button' value='Clear' onClick={onClear} />
        <FrameList frames={stack.map((state) => state.frame)}>
            {children}
        </FrameList>
    </div>
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
