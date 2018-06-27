import React from 'react';
import style from './Matrix.css';

export default function Matrix({selector, reset, input, matrix}) {
    const updatedMatrix = {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        ...matrix,
        xh: 0, yh: 0, oh: 1,
    };
    return <div className={style.matrix}>
        {selector && <div className={style.selector}>{selector}</div>}
        {reset && <div className={style.reset}>{reset}</div>}
        {input && <div className={style.input}>{input}</div>}
        {Object.entries(updatedMatrix).map(([key, value]) => (
            <div key={key} className={style.cell}>
                {value}
            </div>
        ))}
    </div>
}
