import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import {FrameList, } from './stack.js';

class OrderSelectorBase extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.onOrderChange(event.target.value);
    }

    render() {
        return <div>
            <b>Operation order</b><br />
            <select value={this.props.value} onChange={this.onChange}>
                <option value={actions.operationOrders.GLOBAL_ORDER}>Global</option>
                <option value={actions.operationOrders.LOCAL_ORDER}>Local</option>
            </select>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        value: state.order,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onOrderChange: (order) => dispatch(actions.updateOrder(order)),
    };
}

export const OrderSelector = connect(mapStateToProps, mapDispatchToProps)(OrderSelectorBase);
