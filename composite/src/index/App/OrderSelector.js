import React from 'react';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';

function mapStateToProps(state) {
    return {
        order: selectors.order(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onOrderChange: (value) => dispatch(actions.toggleOrder(value)),
    };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class OrderSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onOrderChange = this.onOrderChange.bind(this);
    }

    onOrderChange(event) {
        this.props.onOrderChange(event.target.value);
    }

    render() {
        const {order} = this.props;
        return <div>
            <b>Operation order</b><br />
            <label>
                <input
                    type='checkbox'
                    value='globals'
                    checked={order.globals}
                    onChange={this.onOrderChange} />
                Globals
            </label>
            <label>
                <input
                    type='checkbox'
                    value='locals'
                    checked={order.locals}
                    onChange={this.onOrderChange} />
                Locals
            </label>
        </div>
    }
}
