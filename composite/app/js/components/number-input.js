import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';

class NumberInputBase extends React.Component {
    render() {
        return <input
            type='number'
            value={this.props.value}
            onChange={this.props.onChange} />
    }
}

function mapStateToProps(state) {
    return {
        value: state.number,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChange: (event) => dispatch(actions.updateNumber(
            parseFloat(event.target.value)
        )),
    };
}

const NumberInput = connect(mapStateToProps, mapDispatchToProps)(NumberInputBase);
export default NumberInput;
