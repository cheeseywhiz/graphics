import React from 'react';
import {connect, } from 'react-redux';
import {FrameList, } from './stack.js';

class IntermediatesBase extends React.Component {
    render() {
        return <div>
            <b>Intermediate frames</b>
            <FrameList frames={this.props.frames} />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        frames: state.intermediates,
    };
}

export const Intermediates = connect(mapStateToProps)(IntermediatesBase);
