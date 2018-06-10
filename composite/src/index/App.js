import React from 'react';
import OperationSelector from './OperationSelector.js';
import InputMatrix from './InputMatrix.js';
import ResetButton from './ResetButton.js';
import Stack from './Stack.js';
import OrderSelector from './OrderSelector.js';
import Intermediates from './Intermediates.js';

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
