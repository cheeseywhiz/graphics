import React from 'react';
import OperationSelector from './App/OperationSelector.js';
import InputMatrix from './App/InputMatrix.js';
import ResetButton from './App/ResetButton.js';
import Stack from './App/Stack.js';
import OrderSelector from './App/OrderSelector.js';
import Intermediates from './App/Intermediates.js';
import Graph from './App/Graph.js';

export default function App() {
    return <div>
        <OrderSelector /><br />
        <Stack>
            <InputMatrix
                selector={<OperationSelector />}
                reset={<ResetButton />} />
        </Stack>
        <Intermediates />
        <Graph />
    </div>
}
