import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import selectors from '../../../../selectors.js';
import roundFloatStr from '../common/roundFloatStr.js';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    onEnter: () => dispatch(actions.stackPush()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onKeyPress({key}) {
        switch (key) {
            case "Enter":
                this.props.onEnter();
        }
    }

    onChange({target}) {
        this.props.onNumberChange(parseFloat(target.value));
    }

    componentDidMount() {
        if (this.props.autofocus) this.input.current.select();
    }

    render() {
        const {value, autofocus, onNumberChange, onEnter, ...props} = this.props;
        return <input
            {...props}
            ref={this.input}
            type='number'
            value={Number.isFinite(value) ? roundFloatStr(value) : undefined}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange} />
    }
}

NumberInput.propTypes = {onNumberChange: PropTypes.func.isRequired};
