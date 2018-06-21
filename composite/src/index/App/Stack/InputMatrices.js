import React from 'react';
import {operationNames, } from '../../../actions.js';
import Matrix from './common/Matrix.js';
import zip from '../common/zip.js';
import {focusInput, } from './InputMatrices/NumberInput.js';
import RotationInput from './InputMatrices/RotationInput.js';
import ScaleInput from './InputMatrices/ScaleInput.js';
import MatrixInput from './InputMatrices/MatrixInput.js';

function DefaultMatrix({selector, reset}) {
    return <Matrix
        selector={selector}
        reset={reset} />
}

function RotationMatrix({selector, reset}) {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' disabled/>,
        yi: <MatrixInput matrixKey='yi' disabled/>,
        xj: <MatrixInput matrixKey='xj' disabled/>,
        yj: <MatrixInput matrixKey='yj' disabled/>,
    };
    return <Matrix
        input={<RotationInput onMount={focusInput} />}
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function ScaleMatrix({selector, reset}) {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' />,
        yj: <MatrixInput matrixKey='yj' />,
    };
    return <Matrix
        input={<ScaleInput onMount={focusInput} />}
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function TranslationMatrix({selector, reset}) {
    const matrix = {
        ox: <MatrixInput matrixKey='ox' onMount={focusInput} />,
        oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function ManualMatrix({selector, reset}) {
    const matrix = {
            xi: <MatrixInput matrixKey='xi' onMount={focusInput} />,
            yi: <MatrixInput matrixKey='yi' />,
            ox: <MatrixInput matrixKey='ox' />,
            xj: <MatrixInput matrixKey='xj' />,
            yj: <MatrixInput matrixKey='yj' />,
            oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

const InputMatrices = {
    DefaultMatrix, RotationMatrix, ScaleMatrix, TranslationMatrix, ManualMatrix,
};
export default InputMatrices;

export function getInputMatrixType(operationName) {
    const names = Object.values(operationNames);
    const types = Object.values(InputMatrices);
    const map = {};
    zip(names, types).forEach(([name, type]) => {
        map[name] = type;
    });
    return map[operationName];
}
