import React from 'react';
import Options from './Options/Options.js';
import Stack from './Stack/Stack.js';
import Intermediates from './Stack/Intermediates.js';
import Graph from './Graph/Graph.js';

export default function App() {
    return <div>
        <Options />
        <Stack />
        <Intermediates />
        <Graph />
    </div>
}
