import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import NumberInput from './NumberInput.js';

const mapStateToProps = (state) => ({
    placeholder: 'angle',
});

const mapDispatchToProps = (dispatch) => ({
    onNumberChange: (angle_degrees) => dispatch(actions.setRotationMatrix(angle_degrees)),
});

const RotationInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default RotationInput;
