import React from 'react';
import {
    DefaultMatrix, ScaleMatrix, RotationMatrix, TranslationMatrix, ManualMatrix, identityMatrix,
} from './input-matrices.js';

export class OperationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
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
        this.props.onValueChange(event.target.value);
    }
}

OperationSelector.defaultProps = {
    value: '0',
    onValueChange: (value) => null,
};

export class InputMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.matrices = {
            '0': DefaultMatrix,
            '1': ScaleMatrix,
            '2': RotationMatrix,
            '3': TranslationMatrix,
            '4': ManualMatrix,
        };
    }

    render() {
        const matrixProps = {
            onMatrixChange: this.props.onMatrixChange,
            onAngleChange: this.props.onAngleChange,
            matrix: this.props.matrix,
            angle: this.props.angle,
        };
        return React.createElement(this.matrices[this.props.value], matrixProps);
    }
}

InputMatrix.defaultProps = {
    value: '0',
    onMatrixChange: (value, key) => null,
    onAngleChange: (angle) => null,
    matrix: identityMatrix(),
    angle: '',
};
