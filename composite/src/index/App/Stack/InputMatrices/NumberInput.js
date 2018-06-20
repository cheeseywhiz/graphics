import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import selectors from '../../../../selectors.js';
import roundFloatStr from '../common/roundFloatStr.js';

export function NumberInputBase({onNumberChange, ...props}) {
    const inputProps = {
        ...props,
        type: 'number',
        onChange: (event) => onNumberChange(parseFloat(event.target.value)),
    };

    if (Number.isFinite(inputProps.value)) {
        inputProps.value = roundFloatStr(inputProps.value);
    } else {
        inputProps.value = '';
    }

    return React.createElement('input', inputProps);
}

NumberInputBase.propTypes = {onNumberChange: PropTypes.func.isRequired};

const mapStateToProps = (state) => ({
    value: selectors.matrix(state).number,
});

const mapDispatchToProps = (dispatch) => ({});

const NumberInput = connect(mapStateToProps, mapDispatchToProps)(NumberInputBase);
export default NumberInput;
