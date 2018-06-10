import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import RotationInput from './InputMatrix/RotationInput.js';
import ScaleInput from './InputMatrix/ScaleInput.js';
import MatrixInput from './InputMatrix/MatrixInput.js';

export function DefaultMatrix() {
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

export function RotationMatrix() {
    return <table className='matrix'>
        <thead>
            <tr>
                <td><RotationInput /></td>
                {/* TODO: box spans entire row */}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><MatrixInput matrixKey='xi' disabled/></td>
                <td><MatrixInput matrixKey='yi' disabled/></td>
                <td>0</td>
            </tr>
            <tr>
                <td><MatrixInput matrixKey='xj' disabled/></td>
                <td><MatrixInput matrixKey='yj' disabled/></td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody>
    </table>
}

export function ScaleMatrix() {
    return <table className='matrix'>
        <thead>
            <tr>
                <td><ScaleInput /></td>
                {/* TODO: box spans entire row */}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><MatrixInput matrixKey='xi' /></td>
                <td>0</td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td><MatrixInput matrixKey='yj' /></td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </tbody>
    </table>
}

export function TranslationMatrix() {
    return <table className='matrix'><tbody>
        <tr>
            <td>1</td>
            <td>0</td>
            <td><MatrixInput matrixKey='ox' /></td>
        </tr>
        <tr>
            <td>0</td>
            <td>1</td>
            <td><MatrixInput matrixKey='oy' /></td>
        </tr>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>1</td>
        </tr>
    </tbody></table>
}

export function ManualMatrix() {
    return <table className='matrix'><tbody>
        <tr>
            <td><MatrixInput matrixKey='xi' /></td>
            <td><MatrixInput matrixKey='yi' /></td>
            <td><MatrixInput matrixKey='ox' /></td>
        </tr>
        <tr>
            <td><MatrixInput matrixKey='xj' /></td>
            <td><MatrixInput matrixKey='yj' /></td>
            <td><MatrixInput matrixKey='oy' /></td>
        </tr>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>1</td>
        </tr>
    </tbody></table>
}

export const InputMatrices = {
    DefaultMatrix, RotationMatrix, ScaleMatrix, TranslationMatrix, ManualMatrix,
};

function InputMatrixBase({type}) {
    return React.createElement(type);
}

function mapStateToProps(state) {
    return {
        type: selectors.type(state),
    };
}

const InputMatrix = connect(mapStateToProps)(InputMatrixBase);
export default InputMatrix;
