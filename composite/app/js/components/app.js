import React from 'react';
import {OperationSelector, } from './operation-selector.js';
import {InputMatrix, } from './input-matrices.js';

export default class App extends React.Component {
    render() {
        return <div>
            <OperationSelector />
            <InputMatrix />
        </div>
    }
}
