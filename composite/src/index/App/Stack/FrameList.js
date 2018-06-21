import React from 'react';
import PropTypes from 'prop-types';
import Frame from './FrameList/Frame.js';
import style from './FrameList/FrameList.css';

export default function FrameList({frames, children}) {
    const elements = frames.map((frame, index) => <Frame key={index} frame={frame} />)
    if (children) elements.push(children);
    return <ul className={style.frameList}>
        {elements.map((element, index) => <li key={index} className={style.frameItem}>{element}</li>)}
    </ul>
}

FrameList.propTypes = {frames: PropTypes.array.isRequired};
