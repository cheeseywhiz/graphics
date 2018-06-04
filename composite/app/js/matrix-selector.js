import React from 'react';
import {
    DefaultMatrix, ScaleMatrix, RotationMatrix, TranslationMatrix, ManualMatrix, identityMatrix,
} from './input-matrices.js';
import dictUpdate from './dict-update.js';

export class OperationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.types = {
            '0': DefaultMatrix,
            '1': ScaleMatrix,
            '2': RotationMatrix,
            '3': TranslationMatrix,
            '4': ManualMatrix,
        };
    }

    render() {
        return <select value={this.props.value} onChange={this.onChange}>
            <option value='0' disabled>Operation Type</option>
            <option value='1'>Scale</option>
            <option value='2'>Rotation</option>
            <option value='3'>Translation</option>
            <option value='4'>Manual</option>
        </select>
    }

    onChange(event) {
        const value = event.target.value;
        const type = this.types[value];
        this.props.onValueChange(value);
        this.props.onTypeChange(type);
    }
}

OperationSelector.defaultState = {
    value: '0',
    type: DefaultMatrix,
};
OperationSelector.defaultProps = dictUpdate({
    onValueChange: (value) => null,
    onTypeChange: (type) => null,
}, OperationSelector.defaultState);

export class InputMatrix extends React.Component {
    render() {
        const matrixProps = {
            onMatrixChange: this.props.onMatrixChange,
            onAngleChange: this.props.onAngleChange,
            matrix: this.props.matrix,
            angle: this.props.angle,
        };
        return React.createElement(this.props.type, matrixProps);
    }
}

InputMatrix.defaultState = dictUpdate({
    type: DefaultMatrix,
}, DefaultMatrix.defaultState);
InputMatrix.defaultProps = dictUpdate({
    onMatrixChange: (matrix) => null,
    onAngleChange: (angle) => null,
}, InputMatrix.defaultState);
