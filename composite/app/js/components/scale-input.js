import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import {NumberInput, } from './number-input.js';

function mapStateToProps(state) {
    return {
        placeholder: 'ratio',
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onNumberChange: (value) => {
            const matrix = {
                xi: value, yi: 0, ox: 0,
                xj: 0, yj: value, oy: 0,
            };
            dispatch(actions.setMatrix(matrix));
        },
    };
}

export const ScaleInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
