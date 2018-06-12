import {createSelector, } from 'reselect';
import {operationOrders, types, } from './actions.js';
import combineReducers from './combineReducers.js';

const defaultMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
    number: '',
};

export function matrix(state = defaultMatrix, action) {
    switch (action.type) {
        case types.SET_MATRIX:
            return {...state, ...action.matrix};
        case types.UPDATE_VALUE:
        case types.STACK_PUSH:
        case types.RESET_MATRIX:
            return defaultMatrix;
        default:
            return state;
    }
}

export function value(state = '0', action) {
    switch (action.type) {
        case types.UPDATE_VALUE:
            return action.value;
        default:
            return state;
    }
}

export function order(state = operationOrders.GLOBAL_ORDER, action) {
    switch (action.type) {
        case types.UPDATE_ORDER:
            return action.order;
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
