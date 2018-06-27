import React from 'react';
import {connect, } from 'react-redux';
import actions, {shapeNames, } from '../../common/actions.js';
import selectors from '../common/selectors.js';
import Selector from '../common/Selector.js';

const mapStateToProps = (state) => ({
    shape: selectors.shape(state),
});

const mapDispatchToProps = (dispatch) => ({
    onShapeChange: (shapeName) => dispatch(actions.updateShape(shapeName)),
});

const ShapeSelector = connect(mapStateToProps, mapDispatchToProps)(
    ({shape, onShapeChange}) => {
        const names = Object.values(shapeNames);
        const labels = [
            'None',
            'Square',
            'Unit circle',
            'Knot',
        ];
        return <div>
            <b>Shape</b><br />
            <Selector
                currentValue={shape}
                values={names}
                labels={labels}
                onChange={(event) => onShapeChange(event.target.value)} />
        </div>
    }
);
export default ShapeSelector;
