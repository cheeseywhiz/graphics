import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import dictUpdate from './dict-update.js';

export function identityMatrix() {
    return {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
function round(number, precision) {
    const shift = function(number, exponent) {
        const numArray = ('' + number ).split('e');
        return +(
            numArray[0] +
            'e' +
            (numArray[1] ? (+numArray[1] + exponent) : exponent)
        );
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}

function roundFloatStr(number) {
    return round(number, 2).toString();
}

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
            if (isNaN(inputProps.value)) {
                inputProps.value = '';
            } else {
                inputProps.value = roundFloatStr(inputProps.value);
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
        this.onAngleChange = this.onAngleChange.bind(this);
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
        this.props.onMatrixChange(matrix);
    }

    onAngleChange(angle_degrees) {
        this.props.onAngleChange(angle_degrees);
        const angle_radians = angle_degrees * Math.PI / 180;
        const sin = Math.sin(angle_radians);
        const cos = Math.cos(angle_radians);
        const matrix = Object.assign({}, this.props.matrix, {
            xi: cos, yi: -sin,
            xj: sin, yj: cos,
        });
        this.props.onMatrixChange(matrix);
    }
}

DefaultMatrix.defaultState = {
    matrix: identityMatrix(),
    angle: 0,
};
DefaultMatrix.defaultProps = dictUpdate({
    onMatrixChange: (matrix) => null,
    onAngleChange: (angle) => null,
}, DefaultMatrix.defaultState);

export class ScaleMatrix extends DefaultMatrix {
    render() {
        return <table className='matrix'><tbody>
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
    }
}

export class RotationMatrix extends DefaultMatrix {
    render() {
        return <div>
            <NumberInput value={this.props.angle} placeholder='angle' onNumberChange={this.onAngleChange} />
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
