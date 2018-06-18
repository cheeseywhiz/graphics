import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import Matrix from './common/Matrix.js';
import RotationInput from './InputMatrix/RotationInput.js';
import ScaleInput from './InputMatrix/ScaleInput.js';
import MatrixInput from './InputMatrix/MatrixInput.js';

function DefaultMatrix() {
    return <Matrix />
}

function RotationMatrix() {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' disabled/>,
        yi: <MatrixInput matrixKey='yi' disabled/>,
        xj: <MatrixInput matrixKey='xj' disabled/>,
        yj: <MatrixInput matrixKey='yj' disabled/>,
    };
    return <div>
        <RotationInput />
        <Matrix matrix={matrix} />
    </div>
}

function ScaleMatrix() {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' />,
        yj: <MatrixInput matrixKey='yj' />,
    };
    return <div>
        <ScaleInput />
        <Matrix matrix={matrix} />
    </div>
}

function TranslationMatrix() {
    const matrix = {
        ox: <MatrixInput matrixKey='ox' />,
        oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix matrix={matrix} />
}

function ManualMatrix() {
    const matrix = {
            xi: <MatrixInput matrixKey='xi' />,
            yi: <MatrixInput matrixKey='yi' />,
            ox: <MatrixInput matrixKey='ox' />,
            xj: <MatrixInput matrixKey='xj' />,
            yj: <MatrixInput matrixKey='yj' />,
            oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix matrix={matrix} />
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
