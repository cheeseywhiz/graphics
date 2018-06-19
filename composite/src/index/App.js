import React from 'react';
import OrderSelector from './App/OrderSelector.js';
import Stack from './App/Stack.js';
import Intermediates from './App/Intermediates.js';
import Graph from './App/Graph.js';

export default function App() {
    return <div>
        <OrderSelector /><br />
        <Stack />
        <Intermediates />
        <Graph />
    </div>
}
