import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import NumberInput from './NumberInput.js';

const mapStateToProps = (state) => ({
    placeholder: 'ratio',
});

const mapDispatchToProps = (dispatch) => ({
    onNumberChange: (ratio) => dispatch(actions.setScaleMatrix(ratio)),
});

const ScaleInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default ScaleInput;
