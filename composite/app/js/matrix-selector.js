import React from 'react';
import {
    DefaultMatrix, ScaleMatrix, RotationMatrix, TranslationMatrix, ManualMatrix,
} from './input-matrices.js';
import dictUpdate from './dict-update.js';

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

OperationSelector.defaultState = {
    value: '0',
};
OperationSelector.defaultProps = dictUpdate({
    onValueChange: (value) => null,
}, OperationSelector.defaultState);

export class InputMatrix extends React.Component {
    render() {
        const matrixProps = {
            onMatrixChange: this.props.onMatrixChange,
            onNumberChange: this.props.onNumberChange,
            onFrameChange: this.props.onFrameChange,
            matrix: this.props.matrix,
            number: this.props.number,
        };
        return React.createElement(this.props.type, matrixProps);
    }
}

InputMatrix.defaultState = dictUpdate({
    type: DefaultMatrix,
}, DefaultMatrix.defaultState);
InputMatrix.defaultProps = dictUpdate({
    onMatrixChange: (matrix) => null,
    onNumberChange: (number) => null,
    onFrameChange: (frame) => null,
}, InputMatrix.defaultState);

export class SelectorInputGroup extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.types = {
            '0': DefaultMatrix,
            '1': ScaleMatrix,
            '2': RotationMatrix,
            '3': TranslationMatrix,
            '4': ManualMatrix,
        };
    }

    onValueChange(type) {
        this.props.onValueChange(type);
        this.props.onReset();
    }

    render() {
        const type = this.types[this.props.value];
        return <div>
            <OperationSelector
                value={this.props.value}
                onValueChange={this.onValueChange} />
            <input type='button' value='Reset' onClick={this.props.onReset} />
            <InputMatrix
                type={type}
                matrix={this.props.matrix}
                number={this.props.number}
                onMatrixChange={this.props.onMatrixChange}
                onNumberChange={this.props.onNumberChange}
                onFrameChange={this.props.onFrameChange} />
        </div>
    }
}

SelectorInputGroup.defaultState = Object.assign(
    {},
    OperationSelector.defaultState,
    DefaultMatrix.defaultState,
);
SelectorInputGroup.defaultProps = Object.assign({
    onMatrixChange: (matrix) => null,
    onNumberChange: (number) => null,
    onFrameChange: (frame) => null,
    onReset: () => null,
}, SelectorInputGroup.defaultState);
