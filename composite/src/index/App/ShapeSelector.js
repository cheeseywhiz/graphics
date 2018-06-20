import React from 'react';
import {connect, } from 'react-redux';
import actions, {shapeNames, } from '../../actions.js';
import selectors from '../../selectors.js';
import zip from './common/zip.js';

function mapStateToProps(state) {
    return {
        shape: selectors.shape(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onShapeChange: (shapeName) => dispatch(actions.updateShape(shapeName)),
    };
}

const ShapeSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({shape, onShapeChange}) => {
        const names = Object.values(shapeNames);
        const labels = [
            'None',
            'Square',
        ];
        return <div>
            <b>Shape</b><br />
            <select value={shape} onChange={(event) => onShapeChange(event.target.value)}>
                {zip(names, labels).map(([name, label], index) => (
                    <option
                        key={name}
                        value={name}>
                    {label}
                    </option>
                ))}
            </select>
        </div>
    }
);
export default ShapeSelector;
