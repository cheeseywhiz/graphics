import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import FrameList from './Stack/FrameList.js';

const list = (label, frames) => <div>
    <b>{label}</b>
    <FrameList frames={frames} />
</div>

const mapStateToProps = (state) => ({
    order: selectors.order(state),
    globals: selectors.globals(state),
    locals: selectors.locals(state),
});

const Intermediates = connect(mapStateToProps)(
    ({order, globals, locals}) => (
        <div>
            {order.globals && list('Global frames', globals)}
            {order.locals && list('Local frames', locals)}
        </div>
    )
);
export default Intermediates;
