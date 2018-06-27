import React from 'react';
import {operationNames, } from '../../../common/actions.js';
import Matrix from '../common/Matrix/Matrix.js';
import zip from '../../../common/zip.js';
import RotationInput from './RotationInput.js';
import ScaleInput from './ScaleInput.js';
import MatrixInput from './MatrixInput.js';

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
        input={<RotationInput autofocus />}
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
        input={<ScaleInput autofocus />}
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function TranslationMatrix({selector, reset}) {
    const matrix = {
        ox: <MatrixInput matrixKey='ox' autofocus />,
        oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function ManualMatrix({selector, reset}) {
    const matrix = {
            xi: <MatrixInput matrixKey='xi' autofocus />,
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
