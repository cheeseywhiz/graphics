import React from 'react';
import {connect, } from 'react-redux';
import actions, {shapeNames, } from '../../../common/actions.js';
import selectors from '../../common/selectors.js';
import Selector from '../../common/Selector.js';
import style from './ShapeSelector.css';

const mapStateToProps = (state) => ({
    shape: selectors.shape(state),
    shapeFname: selectors.shapeFname(state),
});

const mapDispatchToProps = (dispatch) => ({
    onShapeChange: (shapeName) => dispatch(actions.updateShape(shapeName)),
    onFnameChange: (fname) => dispatch(actions.updateShapeFname(fname)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ShapeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.onShapeChange = this.onShapeChange.bind(this);
    }

    onShapeChange(shapeName) {
        if (shapeName === shapeNames.FROM_JSON) {
            this.fileInput.current.click();
        }

        this.props.onShapeChange(shapeName);
    }

    onFileChange(file) {
        this.props.onFnameChange(file.name);
    }

    render() {
        const {shape, shapeFname} = this.props;
        const names = Object.values(shapeNames);
        const labels = [
            'None',
            'Square',
            'Unit circle',
            'Knot',
            'From json',
        ];
        return <div>
            <b>Shape</b><br />
            <div className={style.shapeSelector}>
                <Selector
                    currentValue={shape}
                    values={names}
                    labels={labels}
                    onChange={this.onShapeChange} />
                <div>
                    {shapeFname}
                </div>
            </div>
            <input
                ref={this.fileInput}
                type='file'
                className={style.fileInput}
                accept='.json'
                onChange={() => this.onFileChange(this.fileInput.current.files[0])} />
        </div>
    }
}
