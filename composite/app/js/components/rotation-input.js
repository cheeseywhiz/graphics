import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import {NumberInput, } from './number-input.js';

function mapStateToProps(state) {
    return {
        placeholder: 'angle',
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onNumberChange: (angle_degrees) => {
            const angle_radians = angle_degrees * Math.PI / 180;
            const sin = Math.sin(angle_radians);
            const cos = Math.cos(angle_radians);
            const matrix = {
                xi: cos, yi: -sin, ox: 0,
                xj: sin, yj: cos, oy: 0,
            };
            dispatch(actions.setMatrix(matrix));
        },
    };
}

export const RotationInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
