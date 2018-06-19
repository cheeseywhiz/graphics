import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../../actions.js';
import selectors from '../../../selectors.js';

function mapStateToProps(state) {
    return {
        value: selectors.value(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onValueChange: (value) => dispatch(actions.updateValue(value)),
    };
}

const OperationSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({value, onValueChange}) => (
        <select value={value} onChange={(event) => onValueChange(event.target.value)}>
            <option value='0' disabled>Operation Type</option>
            <option value='1'>Rotation</option>
            <option value='2'>Scale</option>
            <option value='3'>Translation</option>
            <option value='4'>Manual</option>
        </select>
    )
);

export default OperationSelector;
