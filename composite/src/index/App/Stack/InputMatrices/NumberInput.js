import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import selectors from '../../../../selectors.js';
import roundFloatStr from '../common/roundFloatStr.js';

export const NumberInputBase = ({value, onNumberChange, ...props}) => (
    <input
        {...props}
        type='number'
        value={Number.isFinite(value) ? roundFloatStr(value) : ''}
        onChange={(event) => onNumberChange(parseFloat(event.target.value))} />
);

NumberInputBase.propTypes = {onNumberChange: PropTypes.func.isRequired};

const mapStateToProps = (state) => ({
    value: selectors.matrix(state).number,
});

const mapDispatchToProps = (dispatch) => ({});

const NumberInput = connect(mapStateToProps, mapDispatchToProps)(NumberInputBase);
export default NumberInput;
