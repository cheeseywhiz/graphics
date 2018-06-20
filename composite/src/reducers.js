import {createSelector, } from 'reselect';
import {types, operationTypes, } from './actions.js';

const defaultMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
    number: '',
};

export function matrix(state = defaultMatrix, action) {
    switch (action.type) {
        case types.SET_MATRIX:
            return {...state, ...action.matrix};
        case types.UPDATE_OPERATION:
        case types.STACK_PUSH:
        case types.RESET_MATRIX:
            return defaultMatrix;
        default:
            return state;
    }
}

export function operation(state = operationTypes.DEFAULT, action) {
    switch (action.type) {
        case types.UPDATE_OPERATION:
            return action.operationType;
        default:
            return state;
    }
}

const defaultOrder = {
    globals: true,
    locals: false,
}

export function order(state = defaultOrder, action) {
    switch (action.type) {
        case types.TOGGLE_ORDER:
            return {...state, [action.value]: !state[action.value]};
        default:
            return state;
    }
}

export function subscriptions(state = new Set(), action) {
    switch (action.type) {
        case types.SELECTOR_SUBSCRIBE: {
            const newState = new Set(state);
            newState.add(createSelector(...action.funcs));
            return newState;
        };
        default:
            return state;
    }
}
