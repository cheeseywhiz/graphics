import {types, } from './actions.js';
import selectors from './selectors.js';

const defaultState = {stack: []};

// not a typical reducer
// computes any fields that need updating given the entire state
function newStack(state, {type}) {
    switch(type) {
        case types.STACK_PUSH:
            return {stack: [...state.stack, state]};
        case types.STACK_POP: {
            const stack = state.stack;
            const length = stack.length;
            return length ? stack[length - 1] : {};
        };
        case types.STACK_CLEAR:
            return defaultState;
        default:
            return {};
    }
}

export default function combineReducersStack(fields) {
    const entries = Object.entries(fields);
    const defaultState_ = {...defaultState};
    entries.forEach(([field, reducer]) => {
        defaultState_[field] = reducer(undefined, {type: undefined});
    });
    return (state = defaultState_, action) => {
        const {stack} = state;
        const newState = {stack};
        entries.forEach(([field, reducer]) => {
            newState[field] = reducer(state[field], action);
        });
        return Object.assign(newState, newStack(state, action));
    };
}
