import {connect, } from 'react-redux';
import {FrameList, } from './stack.js';

function mapStateToProps(state) {
    return {
        frames: state.intermediates,
    };
}

export const Intermediates = connect(mapStateToProps)(FrameList);
