import {combineReducers, } from 'redux';
import combineReducersStack from './reducer/combineReducersStack.js';
import mergeReducers from './reducer/mergeReducers.js';
import {matrix, operation, order, shape, } from './reducer/reducers.js';

const reducer = mergeReducers(
    combineReducersStack({matrix, operation}),
    combineReducers({order, shape}),
);
export default reducer;
