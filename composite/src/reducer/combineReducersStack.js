import {combineReducers, } from 'redux';
import {types, } from '../common/actions.js';

const defaultStack = [];

const stack = (state = defaultStack, {type}) => {
    switch (type) {
        case types.STACK_CLEAR:
            return defaultStack;
        default:
            return state;
    }
};

// not a typical reducer
// computes any fields that need updating given the entire state
const updateStack = (state, {type}) => {
    switch (type) {
        case types.STACK_PUSH:
            return {stack: [...state.stack, state]};
        case types.STACK_POP: {
            const stack = state.stack;
            const length = stack.length;
            return length ? stack[length - 1] : state;
        };
        default:
            return state;
    }
}

export default (fields) => {
    const reducer = combineReducers({...fields, stack});
    return (state, action) => {
        let newState = reducer(state, action);
        const stackUpdate = updateStack(state, action);
        if (stackUpdate === state) return newState;
        if (newState === state) newState = {...state};
        return Object.assign(newState, stackUpdate);
    };
};
