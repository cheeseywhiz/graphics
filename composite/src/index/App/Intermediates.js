import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import FrameList from './Stack/FrameList.js';

function mapStateToProps(state) {
    return {
        globals: selectors.globals(state),
        locals: selectors.locals(state),
    };
}

const Intermediates = connect(mapStateToProps)(
    ({globals, locals}) => (
        <div>
            <b>Global frames</b>
            <FrameList frames={globals} />
            <b>Local frames</b>
            <FrameList frames={locals} />
        </div>
    )
);
export default Intermediates;
