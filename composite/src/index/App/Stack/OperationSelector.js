import React from 'react';
import {connect, } from 'react-redux';
import actions, {operationTypes, } from '../../../actions.js';
import selectors from '../../../selectors.js';
import zip from '../common/zip.js';

function mapStateToProps(state) {
    return {
        operation: selectors.operation(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onValueChange: (operation) => dispatch(actions.updateOperation(operation)),
    };
}

const OperationSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({operation, onValueChange}) => {
        const operations = Object.values(operationTypes);
        const labels = [
            'Operation type',
            'Rotation',
            'Scale',
            'Translation',
            'Manual',
        ];
        return <select value={operation} onChange={(event) => onValueChange(event.target.value)}>
            {zip(operations, labels).map(([value, label], index) => (
                <option
                    key={value}
                    value={value}
                    disabled={index === 0} >
                    {label}
                </option>
            ))}
        </select>
    }
);

export default OperationSelector;
