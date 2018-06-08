import React from 'react';
import {connect, } from 'react-redux';
import {FrameList, } from './stack.js';

class IntermediatesBase extends React.Component {
    render() {
        return <div>
            <b>Global intermediates</b>
            <FrameList frames={this.props.globals} />
            <b>Local intermediates</b>
            <FrameList frames={this.props.locals} />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        globals: state.globals,
        locals: state.locals,
    };
}

export const Intermediates = connect(mapStateToProps)(IntermediatesBase);
