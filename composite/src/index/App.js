import React from 'react';
import {connect, } from 'react-redux';
import selectors from '../selectors.js';
import OperationSelector from './App/OperationSelector.js';
import ResetButton from './App/ResetButton.js';
import Stack from './App/Stack.js';
import OrderSelector from './App/OrderSelector.js';
import Intermediates from './App/Intermediates.js';
import Graph from './App/Graph.js';

function mapStateToProps(state) {
    return {
        InputMatrix: selectors.InputMatrix(state),
    };
}

const App = connect(mapStateToProps)(
    ({InputMatrix}) => (
        <div>
            <OrderSelector /><br />
            <Stack>
                <InputMatrix
                    selector={<OperationSelector />}
                    reset={<ResetButton />} />
            </Stack>
            <Intermediates />
            <Graph />
        </div>
    )
);
export default App;
