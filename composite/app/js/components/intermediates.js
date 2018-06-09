import React from 'react';
import {connect, } from 'react-redux';
import {FrameList, } from './stack.js';

function IntermediatesBase({frames}) {
    return <div>
        <b>Intermediate frames</b>
        <FrameList frames={frames} />
    </div>
}

function mapStateToProps(state) {
    return {
        frames: state.intermediates,
    };
}

export const Intermediates = connect(mapStateToProps)(IntermediatesBase);
