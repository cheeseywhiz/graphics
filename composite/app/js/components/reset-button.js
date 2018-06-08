import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';

class ResetButtonBase extends React.Component {
    render() {
        return <input type='button' value='Reset' onClick={this.props.onClick} />
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        onClick: () => dispatch(actions.resetMatrix()),
    };
}

export const ResetButton = connect(mapStateToProps, mapDispatchToProps)(ResetButtonBase);
