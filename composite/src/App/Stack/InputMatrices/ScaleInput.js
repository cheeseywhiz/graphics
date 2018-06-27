import {connect, } from 'react-redux';
import actions from '../../../common/actions.js';
import selectors from '../../common/selectors.js';
import NumberInput from './common/NumberInput.js';

const mapStateToProps = (state) => ({
    value: selectors.number(state),
    placeholder: 'ratio',
});

const mapDispatchToProps = (dispatch) => ({
    onNumberChange: (ratio) => dispatch(actions.setScaleMatrix(ratio)),
});

const ScaleInput = connect(mapStateToProps, mapDispatchToProps)(NumberInput);
export default ScaleInput;
