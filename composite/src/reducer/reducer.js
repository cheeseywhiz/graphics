import {combineReducers, } from 'redux';
import combineReducersStack from './combineReducersStack.js';
import mergeReducers from './mergeReducers.js';
import * as reducers from './reducers.js';

const {matrix, operation, ...rest} = reducers;
export default mergeReducers(
    combineReducersStack({matrix, operation}),
    combineReducers(rest),
);
