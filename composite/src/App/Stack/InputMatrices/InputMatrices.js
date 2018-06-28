import React from 'react';
import {operationNames, } from '../../../common/actions.js';
import Matrix from '../common/Matrix/Matrix.js';
import zip from '../../../common/zip.js';
import RotationInput from './RotationInput.js';
import ScaleInput from './ScaleInput.js';
import MatrixInput from './MatrixInput.js';
import OperationSelector from './OperationSelector.js';
import ResetButton from './ResetButton.js';
import style from './InputMatrix.css';

const InputMatrixBase = ({matrix, input}) => <div className={style.inputMatrix}>
    <div className={style.selector}>
        <OperationSelector />
    </div>
    <div className={style.reset}>
        <ResetButton />
    </div>
    {input && <div className={style.input}>
        {input}
    </div>}
    <div className={style.matrixContainer}>
        <Matrix matrix={matrix} />
    </div>
</div>

const RotationMatrix = () => {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' disabled />,
        yi: <MatrixInput matrixKey='yi' disabled />,
        xj: <MatrixInput matrixKey='xj' disabled />,
        yj: <MatrixInput matrixKey='yj' disabled />,
    };
    return <InputMatrixBase
        matrix={matrix}
        input={<RotationInput autofocus />} />
};

const ScaleMatrix = () => {
    const matrix = {
        xi: <MatrixInput matrixKey='xi' />,
        yj: <MatrixInput matrixKey='yj' />,
    };
    return <InputMatrixBase
        matrix={matrix}
        input={<ScaleInput autofocus />} />
};

const TranslationMatrix = () => {
    const matrix = {
        ox: <MatrixInput matrixKey='ox' autofocus />,
        oy: <MatrixInput matrixKey='oy' />,
    };
    return <InputMatrixBase matrix={matrix} />
};

const ManualMatrix = () => {
    const matrix = {
            xi: <MatrixInput matrixKey='xi' autofocus />,
            yi: <MatrixInput matrixKey='yi' />,
            ox: <MatrixInput matrixKey='ox' />,
            xj: <MatrixInput matrixKey='xj' />,
            yj: <MatrixInput matrixKey='yj' />,
            oy: <MatrixInput matrixKey='oy' />,
    };
    return <InputMatrixBase matrix={matrix} />
};

const InputMatrices = {
    InputMatrixBase, RotationMatrix, ScaleMatrix, TranslationMatrix, ManualMatrix,
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
