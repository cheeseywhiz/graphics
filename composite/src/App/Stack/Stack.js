import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../common/actions.js';
import selectors from '../common/selectors.js';
import FrameList from './FrameList/FrameList.js';
import {getInputMatrixType, } from './InputMatrices/InputMatrices.js';

const mapStateToProps = (state) => ({
    shortStack: selectors.shortStack(state),
    operation: selectors.operation(state),
});

const mapDispatchToProps = (dispatch) => ({
    onPush: () => dispatch(actions.stackPush()),
    onPop: () => dispatch(actions.stackPop()),
    onClear: () => dispatch(actions.stackClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    ({shortStack, operation, onPush, onPop, onClear}) => {
        const InputMatrix = getInputMatrixType(operation);
        return <div>
            <b>Operation stack</b><br />
            <input type='button' value='Push' onClick={onPush} />
            <input type='button' value='Pop' onClick={onPop} />
            <input type='button' value='Clear' onClick={onClear} />
            <FrameList frames={shortStack.map(selectors.frame)}>
                <InputMatrix />
            </FrameList>
        </div>
    }
);
