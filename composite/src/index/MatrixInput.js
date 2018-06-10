import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import selectors from '../selectors.js';
import {NumberInputBase, } from './NumberInput.js';

function mapStateToProps(state, ownProps) {
    return {
        value: selectors.matrix(state)[ownProps.matrixKey],
        placeholder: ownProps.matrixKey,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onNumberChange: (value) => dispatch(actions.updateMatrix(ownProps.matrixKey, value)),
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const props = {...ownProps, ...stateProps, ...dispatchProps};
    const {matrixKey, ...rest} = props;
    return rest;
}

const MatrixInput = connect(mapStateToProps, mapDispatchToProps, mergeProps)(NumberInputBase);
MatrixInput.propTypes = {matrixKey: PropTypes.string.isRequired};
export default MatrixInput;
