import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';

const mapStateToProps = (state) => ({
    order: selectors.order(state),
});

const mapDispatchToProps = (dispatch) => ({
    onOrderChange: (value) => dispatch(actions.toggleOrder(value)),
});

const OrderSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({order, onOrderChange}) => {
        const onChange = (event) => onOrderChange(event.target.value);
        const {globals, locals} = order;
        return <div>
            <b>Operation order</b><br />
            <label>
                <input
                    type='checkbox'
                    value='globals'
                    checked={globals}
                    onChange={onChange} />
                Globals
            </label>
            <label>
                <input
                    type='checkbox'
                    value='locals'
                    checked={locals}
                    onChange={onChange} />
                Locals
            </label>
        </div>
    }
);
export default OrderSelector;
