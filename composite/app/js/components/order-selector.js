import React from 'react';
import {connect, } from 'react-redux';
import * as actions from '../actions.js';
import selectors from '../selectors.js';
import {FrameList, } from './stack.js';

function OrderSelectorBase({value, onOrderChange}) {
    return <div>
        <b>Operation order</b><br />
        <select value={value} onChange={(event) => onOrderChange(event.target.value)}>
            <option value={actions.operationOrders.GLOBAL_ORDER}>Global</option>
            <option value={actions.operationOrders.LOCAL_ORDER}>Local</option>
        </select>
    </div>
}

function mapStateToProps(state) {
    return {
        value: selectors.order(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onOrderChange: (order) => dispatch(actions.updateOrder(order)),
    };
}

export const OrderSelector = connect(mapStateToProps, mapDispatchToProps)(OrderSelectorBase);
