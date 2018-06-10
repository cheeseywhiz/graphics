import {connect, } from 'react-redux';
import * as actions from '../../../actions.js';
import NumberInput from './NumberInput.js';

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

const RotationInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default RotationInput;
