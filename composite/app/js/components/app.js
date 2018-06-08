import React from 'react';
import {OperationSelector, } from './operation-selector.js';
import {InputMatrix, } from './input-matrices.js';
import {ResetButton, } from './reset-button.js';
import {Stack, } from './stack.js';
import {Intermediates, } from './intermediates.js';

export default class App extends React.Component {
    render() {
        return <div>
            <Stack>
                <OperationSelector />
                <ResetButton />
                <InputMatrix />
            </Stack>
            <Intermediates />
        </div>
    }
}
