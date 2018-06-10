import * as THREE from 'three';
import {types, operationOrders, } from './actions.js';
import selectors from './selectors.js';

const identityFrame = new THREE.Matrix4().identity();
const defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        number: '',
    },
    value: '0',
    order: operationOrders.GLOBAL_ORDER,
    stack: [],
};

function stackPush(state) {
    if (selectors.frame(state).equals(identityFrame)) return state;
    const stack = [...state.stack];
    stack.push(state);
    return resetMatrix({...state, stack});
}

function stackPop(state) {
    const stack = state.stack;
    const length = stack.length;

    if (length) {
        return stack[length - 1];
    } else {
        return state;
    }
}

function stackClear(newState) {
    const {stack} = defaultState;
    return Object.assign(newState, {stack});
}

function resetMatrix(newState) {
    const {matrix} = defaultState;
    return Object.assign(newState, {matrix});
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case types.UPDATE_VALUE: {
            const {value} = action;
            return resetMatrix({...state, value});
        };
        case types.UPDATE_ORDER: {
            const {order} = action;
            return {...state, order};
        };
        case types.SET_MATRIX: {
            const matrix = {...state.matrix, ...action.matrix};
            return {...state, matrix};
        };
        case types.STACK_PUSH:
            return stackPush(state);
        case types.STACK_POP:
            return stackPop(state);
        case types.STACK_CLEAR:
            return stackClear({...state});
        case types.RESET_MATRIX:
            return resetMatrix({...state});
        default:
            return state;
    }
}
