import React from 'react';
import PropTypes from 'prop-types';
import Frame from './FrameList/Frame.js';

export default function FrameList({frames, children}) {
    const elements = frames.map((frame, index) => <Frame key={index} frame={frame} />)
    if (children) elements.push(children);
    return <ul>
        {elements.map((element, index) => <li key={index}>{element}</li>)}
    </ul>
}

FrameList.propTypes = {frames: PropTypes.array.isRequired};
