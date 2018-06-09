import * as THREE from 'three';
import * as actions from './actions.js';
import selectors from './selectors.js';

const identityFrame = new THREE.Matrix4().identity();
const defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        number: '',
    },
    value: '0',
    order: actions.operationOrders.GLOBAL_ORDER,
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
        case actions.types.UPDATE_VALUE: {
            const {value} = action;
            return {...state, value};
        };
        case actions.types.UPDATE_ORDER: {
            const {order} = action;
            return {...state, order};
        };
        case actions.types.SET_MATRIX: {
            const matrix = {...state.matrix, ...action.matrix};
            return {...state, matrix};
        };
        case actions.types.STACK_PUSH:
            return stackPush(state);
        case actions.types.STACK_POP:
            return stackPop(state);
        case actions.types.STACK_CLEAR:
            return stackClear({...state});
        case actions.types.RESET_MATRIX:
            return resetMatrix({...state});
        default:
            return state;
    }
}
