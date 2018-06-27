import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../common/selectors.js';
import FrameList from './FrameList/FrameList.js';

const list = (label, frames) => <div>
    <b>{label}</b>
    <FrameList frames={frames} />
</div>

const mapStateToProps = (state) => ({
    geometry: selectors.geometry(state),
    globals: selectors.globals(state),
    locals: selectors.locals(state),
});

export default connect(mapStateToProps)(
    ({geometry, globals, locals}) => (
        <div>
            {geometry.globals && list('Global frames', globals)}
            {geometry.locals && list('Local frames', locals)}
        </div>
    )
);
