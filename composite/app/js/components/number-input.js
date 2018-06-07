import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import roundFloatStr from '../round-float-str.js';

export class NumberInputBase extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        const inputProps = {
            ...this.props,
            type: 'number',
            onChange: this.onChange,
        };
        delete inputProps.onNumberChange;

        if ('value' in inputProps) {
            if (Number.isFinite(inputProps.value)) {
                inputProps.value = roundFloatStr(inputProps.value);
            } else {
                inputProps.value = '';
            }
        }

        return React.createElement('input', inputProps);
    }

    onChange(event) {
        this.props.onNumberChange(parseFloat(event.target.value));
    }
}

NumberInputBase.defaultProps = {onNumberChange: (value) => null};

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        value: state.number,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onNumberChange: (value) => dispatch(actions.updateNumber(value)),
    };
}

export const NumberInput = connect(mapStateToProps, mapDispatchToProps)(NumberInputBase);
