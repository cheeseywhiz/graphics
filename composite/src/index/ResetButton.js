import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';

function ResetButtonBase({onClick}) {
    return <input type='button' value='Reset' onClick={onClick} />
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        onClick: () => dispatch(actions.resetMatrix()),
    };
}

const ResetButton = connect(mapStateToProps, mapDispatchToProps)(ResetButtonBase);
export default ResetButton;
