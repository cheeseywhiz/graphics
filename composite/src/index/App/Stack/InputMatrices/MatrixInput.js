import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import selectors from '../../../../selectors.js';
import {NumberInputBase, } from './NumberInput.js';

const mapStateToProps = (state, {matrixKey}) => ({
    value: selectors.matrix(state)[matrixKey],
    placeholder: matrixKey,
});

const mapDispatchToProps = (dispatch, {matrixKey}) => ({
    onNumberChange: (value) => dispatch(actions.updateMatrix(matrixKey, value)),
});

const mergeProps = (stateProps, dispatchProps, {matrixKey, ...ownProps}) => ({
    ...ownProps, ...stateProps, ...dispatchProps,
});

const MatrixInput = connect(mapStateToProps, mapDispatchToProps, mergeProps)(NumberInputBase);
MatrixInput.propTypes = {matrixKey: PropTypes.string.isRequired};
export default MatrixInput;
