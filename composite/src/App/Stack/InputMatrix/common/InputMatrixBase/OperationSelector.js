import React from 'react';
import {connect, } from 'react-redux';
import actions, {operationNames, } from '../../../../../common/actions.js';
import selectors from '../../../../common/selectors.js';
import Selector from '../../../../common/Selector.js';

const mapStateToProps = (state) => ({
    operation: selectors.operation(state),
});

const mapDispatchToProps = (dispatch) => ({
    onValueChange: (operation) => dispatch(actions.updateOperation(operation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    ({operation, onValueChange}) => {
        const names = Object.values(operationNames);
        const labels = [
            'Operation type',
            'Rotation',
            'Scale',
            'Translation',
            'Manual',
        ];
        return <Selector
            currentValue={operation}
            values={names}
            labels={labels}
            onChange={onValueChange}
            disableFirst />
    }
);
