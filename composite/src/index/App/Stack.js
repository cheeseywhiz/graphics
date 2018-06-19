import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';
import FrameList from './Stack/FrameList.js';
import OperationSelector from './Stack/OperationSelector.js';
import ResetButton from './Stack/ResetButton.js';

function mapStateToProps(state) {
    return {
        stack: selectors.stack(state),
        InputMatrix: selectors.InputMatrix(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onPush: () => dispatch(actions.stackPush()),
        onPop: () => dispatch(actions.stackPop()),
        onClear: () => dispatch(actions.stackClear()),
    };
}

const Stack = connect(mapStateToProps, mapDispatchToProps)(
    ({stack, InputMatrix, onPush, onPop, onClear}) => (
        <div>
            <b>Operation stack</b><br />
            <input type='button' value='Push' onClick={onPush} />
            <input type='button' value='Pop' onClick={onPop} />
            <input type='button' value='Clear' onClick={onClear} />
            <FrameList frames={stack.map(selectors.frame)}>
                <InputMatrix
                    selector={<OperationSelector />}
                    reset={<ResetButton />} />
            </FrameList>
        </div>
    )
);

export default Stack;
