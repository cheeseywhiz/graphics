import {connect, } from 'react-redux';
import * as actions from '../../actions.js';
import NumberInput from './NumberInput.js';

function mapStateToProps(state) {
    return {
        placeholder: 'ratio',
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onNumberChange: (ratio) => dispatch(actions.setScaleMatrix(ratio)),
    };
}

const ScaleInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default ScaleInput;
