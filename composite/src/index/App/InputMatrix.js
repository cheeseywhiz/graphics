import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import Matrix from './common/Matrix.js';
import RotationInput from './InputMatrix/RotationInput.js';
import ScaleInput from './InputMatrix/ScaleInput.js';
import MatrixInput from './InputMatrix/MatrixInput.js';

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
        input={<RotationInput />}
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
        input={<ScaleInput />}
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function TranslationMatrix({selector, reset}) {
    const matrix = {
        ox: <MatrixInput matrixKey='ox' />,
        oy: <MatrixInput matrixKey='oy' />,
    };
    return <Matrix
        selector={selector}
        reset={reset}
        matrix={matrix} />
}

function ManualMatrix({selector, reset}) {
    const matrix = {
            xi: <MatrixInput matrixKey='xi' />,
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

export const InputMatrices = {
    DefaultMatrix, RotationMatrix, ScaleMatrix, TranslationMatrix, ManualMatrix,
};

function InputMatrixBase(props) {
    const {type, ...newProps} = props;
    return React.createElement(type, newProps);
}

function mapStateToProps(state) {
    return {
        type: selectors.type(state),
    };
}

const InputMatrix = connect(mapStateToProps)(InputMatrixBase);
export default InputMatrix;
