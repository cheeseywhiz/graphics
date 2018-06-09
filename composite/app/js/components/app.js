import React from 'react';
import {OperationSelector, } from './operation-selector.js';
import {InputMatrix, } from './input-matrices.js';
import {ResetButton, } from './reset-button.js';
import {Stack, } from './stack.js';
import {OrderSelector, } from './order-selector.js';
import {Intermediates, } from './intermediates.js';

export default function App() {
    return <div>
        <OrderSelector /><br />
        <Stack>
            <OperationSelector />
            <ResetButton />
            <InputMatrix />
        </Stack>
        <Intermediates />
    </div>
}
