import React from 'react';
import Matrix from '../../../common/Matrix/Matrix.js';
import OperationSelector from './OperationSelector.js';
import ResetButton from './ResetButton.js';
import style from './InputMatrixBase.css';

export default ({matrix, input}) => <div className={style.inputMatrix}>
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
