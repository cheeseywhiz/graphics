import React from 'react';
import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import actions from '../../../../actions.js';
import selectors from '../../../../selectors.js';
import roundFloatStr from '../common/roundFloatStr.js';

export const focusInput = (input) => input.select();

@connect()
export class NumberInputBase extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onKeyPress({key}) {
        switch (key) {
            case "Enter":
                this.props.dispatch(actions.stackPush());
        }
    }

    onChange({target}) {
        this.props.onNumberChange(parseFloat(target.value));
    }

    componentDidMount() {
        this.props.onMount(this.input.current);
    }

    render() {
        const {value, onNumberChange, onMount, dispatch, ...props} = this.props;
        return <input
            {...props}
            ref={this.input}
            type='number'
            value={Number.isFinite(value) ? roundFloatStr(value) : undefined}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange} />
    }
}

NumberInputBase.propTypes = {onNumberChange: PropTypes.func.isRequired};
NumberInputBase.defaultProps = {
    onMount: (input) => {},
};

const mapStateToProps = (state) => ({
    value: selectors.matrix(state).number,
});

const NumberInput = connect(mapStateToProps)(NumberInputBase);
export default NumberInput;
