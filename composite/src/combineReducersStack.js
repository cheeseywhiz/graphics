import {types, } from './actions.js';
import selectors from './selectors.js';

const defaultStack = [];

// not a typical reducer
// computes any fields that need updating given the entire state
function newStack(state, {type}) {
    switch(type) {
        case types.STACK_PUSH: {
            const stack = [...state.stack];
            stack.push(state);
            return {stack};
        };
        case types.STACK_POP: {
            const stack = state.stack;
            const length = stack.length;

            if (length) {
                return stack[length - 1];
            } else {
                return {};
            }
        };
        case types.STACK_CLEAR:
            return {stack: defaultStack};
        default:
            return {};
    }
}

export default function combineReducers(fields) {
    const entries = Object.entries(fields);
    const defaultState = {stack: defaultStack};
    entries.forEach(([field, reducer]) => {
        defaultState[field] = reducer(undefined, {type: undefined});
    });
    return (state = defaultState, action) => {
        const {stack} = state;
        const newState = {stack};
        entries.forEach(([field, reducer]) => {
            newState[field] = reducer(state[field], action);
        });
        return Object.assign(newState, newStack(state, action));
    };
}
