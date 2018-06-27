import React from 'react';
import {connect, } from 'react-redux';
import actions, {operationNames, } from '../../common/actions.js';
import selectors from '../common/selectors.js';
import zip from '../../common/zip.js';

const mapStateToProps = (state) => ({
    operation: selectors.operation(state),
});

const mapDispatchToProps = (dispatch) => ({
    onValueChange: (operation) => dispatch(actions.updateOperation(operation)),
});

const OperationSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({operation, onValueChange}) => {
        const names = Object.values(operationNames);
        const labels = [
            'Operation type',
            'Rotation',
            'Scale',
            'Translation',
            'Manual',
        ];
        return <select value={operation} onChange={(event) => onValueChange(event.target.value)}>
            {zip(names, labels).map(([name, label], index) => (
                <option
                    key={name}
                    value={name}
                    disabled={index === 0} >
                    {label}
                </option>
            ))}
        </select>
    }
);
export default OperationSelector;
