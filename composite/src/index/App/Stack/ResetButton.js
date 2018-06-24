import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../actions.js';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    onClick: () => dispatch(actions.resetMatrix()),
});

const ResetButton = connect(mapStateToProps, mapDispatchToProps)(
    ({onClick}) => (
        <input type='button' value='Reset' onClick={onClick} />
    )
);
export default ResetButton;
