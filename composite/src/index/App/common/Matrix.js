import React from 'react';

export default function Matrix({selector, reset, input, matrix}) {
    const updatedMatrix = {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        ...matrix,
        xh: 0, yh: 0, oh: 1,
    };
    return <span className='matrix'>
        {selector && <span className='matrix-selector'>{selector}</span>}
        {reset && <span className='matrix-reset'>{reset}</span>}
        {input && <span className='matrix-input'>{input}</span>}
        {Object.entries(updatedMatrix).map(([key, value]) => (
            <span key={key} className='matrix-cell'>
                {value}
            </span>
        ))}
    </span>
}
