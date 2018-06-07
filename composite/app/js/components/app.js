import React from 'react';
import {NumberInput, } from './number-input.js';
import {MatrixInput, } from './matrix-input.js';

export default class App extends React.Component {
    render() {
        return <div>
            <NumberInput placeholder='number' />
            <MatrixInput matrixKey='xi' />
            <MatrixInput matrixKey='yi' />
            <MatrixInput matrixKey='xj' />
            <MatrixInput matrixKey='yj' />
            <MatrixInput matrixKey='ox' />
            <MatrixInput matrixKey='oy' />
        </div>
    }
}
