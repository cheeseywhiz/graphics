import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import FrameList from './Stack/FrameList.js';

function mapStateToProps(state) {
    return {
        frames: selectors.intermediates(state),
    };
}

const Intermediates = connect(mapStateToProps)(
    ({frames}) => (
        <div>
            <b>Intermediate frames</b>
            <FrameList frames={frames} />
        </div>
    )
);

export default Intermediates;
