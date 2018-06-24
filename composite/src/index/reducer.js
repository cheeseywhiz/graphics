import {combineReducers, } from 'redux';
import combineReducersStack from './reducer/combineReducersStack.js';
import mergeReducers from './reducer/mergeReducers.js';
import * as reducers from './reducer/reducers.js';

const {matrix, operation, ...rest} = reducers;
const reducer = mergeReducers(
    combineReducersStack({matrix, operation}),
    combineReducers(rest),
);
export default reducer;
