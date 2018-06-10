import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';
import FrameList from './Stack/FrameList.js';

function StackBase({onPush, onPop, onClear, stack, children}) {
    return <div>
        <b>Operation stack</b><br />
        <input type='button' value='Push' onClick={onPush} />
        <input type='button' value='Pop' onClick={onPop} />
        <input type='button' value='Clear' onClick={onClear} />
        <FrameList frames={stack.map((state) => selectors.frame(state))}>
            {children}
        </FrameList>
    </div>
}

function mapStateToProps(state) {
    return {
        stack: selectors.stack(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onPush: () => dispatch(actions.stackPush()),
        onPop: () => dispatch(actions.stackPop()),
        onClear: () => dispatch(actions.stackClear()),
    };
}

const Stack = connect(mapStateToProps, mapDispatchToProps)(StackBase);
export default Stack;
