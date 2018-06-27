import React from 'react';
import zip from '../../common/zip.js';

const Selector = ({currentValue, values, labels, onChange, disableFirst}) => (
    <select value={currentValue} onChange={onChange}>
        {zip(values, labels).map(([value, label], index) => (
            <option
                key={value}
                value={value}
                disabled={disableFirst && index === 0}>
                {label}
            </option>
        ))}
    </select>
);
export default Selector;
