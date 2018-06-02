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

class MatrixInput extends React.Component {
    constructor(props) {
        super(props);
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    render() {
        return <NumberInput
            value={this.props.matrix[this.props.matrixKey]}
            placeholder={this.props.matrixKey}
            onNumberChange={this.onNumberChange}
            disabled={this.props.disabled} />
    }

    onNumberChange(value) {
        this.props.onMatrixChange(value, this.props.matrixKey);
    }
}

MatrixInput.propTypes = {disabled: PropTypes.bool};
MatrixInput.defaultProps = {
    matrix: identityMatrix(),
    onMatrixChange: (value, key) => null,
};

export class DefaultMatrix extends React.Component {
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
}

DefaultMatrix.defaultProps = {
    matrix: identityMatrix(),
    angle: 0,
    onMatrixChange: (value, matrixKey) => null,
    onAngleChange: (angle) => null,
};

export class ScaleMatrix extends DefaultMatrix {
    render() {
        return <table className='matrix'><tbody>
            <tr>
                <td><MatrixInput matrixKey='xi' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
                <td>0</td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td><MatrixInput matrixKey='yj' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
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
            <NumberInput value={this.props.angle} placeholder='angle' onNumberChange={this.props.onAngleChange} />
            <table className='matrix'><tbody>
                <tr>
                    <td><MatrixInput matrixKey='xi' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} disabled/></td>
                    <td><MatrixInput matrixKey='yi' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} disabled/></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><MatrixInput matrixKey='xj' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} disabled/></td>
                    <td><MatrixInput matrixKey='yj' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} disabled/></td>
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
                <td><MatrixInput matrixKey='ox' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>1</td>
                <td><MatrixInput matrixKey='oy' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
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
                <td><MatrixInput matrixKey='xi' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
                <td><MatrixInput matrixKey='yi' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
                <td><MatrixInput matrixKey='ox' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
            </tr>
            <tr>
                <td><MatrixInput matrixKey='xj' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
                <td><MatrixInput matrixKey='yj' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
                <td><MatrixInput matrixKey='oy' matrix={this.props.matrix} onMatrixChange={this.props.onMatrixChange} /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody></table>
    }
}
