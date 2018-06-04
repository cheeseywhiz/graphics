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

export class SelectorInputGroup extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onReset = this.onReset.bind(this);
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
        this.onReset();
    }

    onReset() {
        const state = DefaultMatrix.defaultState;
        this.props.onMatrixChange(state.matrix);
        this.props.onAngleChange(state.angle);
    }

    render() {
        const type = this.types[this.props.value];
        return <div>
            <OperationSelector
                value={this.props.value}
                onValueChange={this.onValueChange} />
            <input type='button' value='Reset' onClick={this.onReset} />
            <InputMatrix
                type={type}
                matrix={this.props.matrix}
                angle={this.props.angle}
                onMatrixChange={this.props.onMatrixChange}
                onAngleChange={this.props.onAngleChange} />
        </div>
    }
}

SelectorInputGroup.defaultState = Object.assign(
    {},
    OperationSelector.defaultState,
    DefaultMatrix.defaultState,
);
SelectorInputGroup.defaultProps = Object.assign(
    {},
    SelectorInputGroup.defaultState
);
