import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import selectors from '../../../../selectors.js';
import NumberInput from './NumberInput.js';

const mapStateToProps = (state) => ({
    value: selectors.number(state),
    placeholder: 'ratio',
});

const mapDispatchToProps = (dispatch) => ({
    onNumberChange: (ratio) => dispatch(actions.setScaleMatrix(ratio)),
});

const ScaleInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default ScaleInput;
