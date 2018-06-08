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
        onNumberChange: (angle_degrees) => dispatch(actions.setRotationMatrix(angle_degrees)),
    };
}

export const RotationInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
