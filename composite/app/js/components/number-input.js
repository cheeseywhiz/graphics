import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import roundFloatStr from '../round-float-str.js';

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

function mapStateToProps(state) {
    return {
        value: state.matrix.number,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export const NumberInput = connect(mapStateToProps, mapDispatchToProps)(NumberInputBase);
