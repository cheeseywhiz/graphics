import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import dictUpdate from './dict-update.js';
import roundFloatStr from './round-float-str.js';

class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        const inputProps = dictUpdate({
            type: 'number',
            onChange: this.onChange,
        }, this.props);
        delete inputProps.onNumberChange;

        if ('value' in inputProps) {
            if (Number.isFinite(inputProps.value)) {
                inputProps.value = roundFloatStr(inputProps.value);
            } else {
                inputProps.value = '';
            }
        }

        return React.createElement('input', inputProps);
    }

    onChange(event) {
        this.props.onNumberChange(parseFloat(event.target.value));
    }
}

NumberInput.defaultProps = {onNumberChange: (value) => null};

class DictInput extends React.Component {
    constructor(props) {
        super(props);
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    render() {
        return <NumberInput
            value={this.props.dict[this.props.dictKey]}
            placeholder={this.props.dictKey}
            onNumberChange={this.onNumberChange}
            disabled={this.props.disabled} />
    }

    onNumberChange(value) {
        this.props.onKeyValueChange(this.props.dictKey, value);
    }
}

DictInput.propTypes = {disabled: PropTypes.bool};
DictInput.defaultProps = {
    onKeyValueChange: (key, value) => null,
};

export class DefaultMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onKeyValueChange = this.onKeyValueChange.bind(this);
    }

    render() {
        return <table className='matrix'><tbody>
            <tr>
                <td>1</td>
                <td>0</td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td>1</td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }

    onKeyValueChange(key, value) {
        const matrix = Object.assign({}, this.props.matrix);
        matrix[key] = value;
        this.onMatrixChange(matrix);
    }

    onMatrixChange(matrix) {
        const frame = new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
            matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
        this.props.onMatrixChange(matrix);
        this.props.onFrameChange(frame);
    }

    onNumberChange(number) {}
}

DefaultMatrix.defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
    },
    number: '',
};
DefaultMatrix.defaultProps = dictUpdate({
    onMatrixChange: (matrix) => null,
    onNumberChange: (number) => null,
    onFrameChange: (frame) => null,
}, DefaultMatrix.defaultState);

export class ScaleMatrix extends DefaultMatrix {
    onNumberChange(ratio) {
        const matrix = Object.assign({}, this.props.matrix, {
            xi: ratio, yj: ratio,
        });
        this.props.onNumberChange(ratio);
        this.onMatrixChange(matrix);
    }

    render() {
        return <div>
            <NumberInput value={this.props.number} placeholder='ratio' onNumberChange={this.onNumberChange} />
            <table className='matrix'><tbody>
                <tr>
                    <td><DictInput dictKey='xi' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td><DictInput dictKey='yj' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </tbody></table>
        </div>
    }
}

export class RotationMatrix extends DefaultMatrix {
    onNumberChange(angle_degrees) {
        const angle_radians = angle_degrees * Math.PI / 180;
        const sin = Math.sin(angle_radians);
        const cos = Math.cos(angle_radians);
        const matrix = Object.assign({}, this.props.matrix, {
            xi: cos, yi: -sin,
            xj: sin, yj: cos,
        });
        this.props.onNumberChange(angle_degrees);
        this.onMatrixChange(matrix);
    }

    render() {
        return <div>
            <NumberInput value={this.props.number} placeholder='angle' onNumberChange={this.onNumberChange} />
            <table className='matrix'><tbody>
                <tr>
                    <td><DictInput dictKey='xi' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} disabled/></td>
                    <td><DictInput dictKey='yi' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} disabled/></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><DictInput dictKey='xj' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} disabled/></td>
                    <td><DictInput dictKey='yj' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} disabled/></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </tbody></table>
        </div>
    }
}

export class TranslationMatrix extends DefaultMatrix {
    render() {
        return <table className='matrix'><tbody>
            <tr>
                <td>1</td>
                <td>0</td>
                <td><DictInput dictKey='ox' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>1</td>
                <td><DictInput dictKey='oy' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }
}

export class ManualMatrix extends DefaultMatrix {
    render() {
        return <table className='matrix'><tbody>
            <tr>
                <td><DictInput dictKey='xi' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                <td><DictInput dictKey='yi' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                <td><DictInput dictKey='ox' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
            </tr>
            <tr>
                <td><DictInput dictKey='xj' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                <td><DictInput dictKey='yj' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
                <td><DictInput dictKey='oy' dict={this.props.matrix} onKeyValueChange={this.onKeyValueChange} /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }
}
