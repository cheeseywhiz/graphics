import {combineReducers, } from 'redux';
import combineReducersStack from './combineReducersStack.js';
import mergeReducers from './mergeReducers.js';
import * as reducers from './reducers.js';

const {matrix, operation, ...rest} = reducers;
const reducer = mergeReducers(
    combineReducersStack({matrix, operation}),
    combineReducers(rest),
);
export default reducer;
