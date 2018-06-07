import React from 'react';
import {RotationInput, } from './rotation-input.js';
import {ScaleInput, } from './scale-input.js';
import {MatrixInput, } from './matrix-input.js';

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

export class RotationMatrix extends React.Component {
    render() {
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
}

export class ScaleMatrix extends React.Component {
    render() {
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
}

export class TranslationMatrix extends React.Component {
    render() {
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
}

export class ManualMatrix extends React.Component {
    render() {
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
}
