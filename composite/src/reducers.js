import {createSelector, } from 'reselect';
import combineReducersStack from './combineReducersStack.js';
import {types, operationNames, shapeNames, } from './actions.js';

const defaultMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
    number: '',
};

function matrix(state = defaultMatrix, {type, matrix}) {
    switch (type) {
        case types.SET_MATRIX:
            return {...state, ...matrix};
        case types.UPDATE_OPERATION:
        case types.STACK_PUSH:
        case types.RESET_MATRIX:
            return defaultMatrix;
        default:
            return state;
    }
}

function operation(state = operationNames.DEFAULT, {type, operationName}) {
    switch (type) {
        case types.UPDATE_OPERATION:
            return operationName;
        default:
            return state;
    }
}

export const stack = combineReducersStack({matrix, operation});

const defaultOrder = {
    globals: true,
    locals: false,
}

export function order(state = defaultOrder, {type, value}) {
    switch (type) {
        case types.TOGGLE_ORDER:
            return {...state, [value]: !state[value]};
        default:
            return state;
    }
}

export function shape(state = shapeNames.DEFAULT, {type, shapeName}) {
    switch (type) {
        case types.UPDATE_SHAPE:
            return shapeName;
        default:
            return state;
    }
}

export function subscriptions(state = new Set(), {type, funcs}) {
    switch (type) {
        case types.SELECTOR_SUBSCRIBE: {
            const newState = new Set(state);
            newState.add(createSelector(...funcs));
            return newState;
        };
        default:
            return state;
    }
}
