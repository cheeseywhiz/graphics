import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import {NumberInputBase, } from './number-input.js';

function mapStateToProps(state, ownProps) {
    return {
        value: state.matrix[ownProps.matrixKey],
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
    delete props.matrixKey;
    return props;
}

export const MatrixInput = connect(mapStateToProps, mapDispatchToProps, mergeProps)(NumberInputBase);
MatrixInput.propTypes = {matrixKey: PropTypes.string.isRequired};
