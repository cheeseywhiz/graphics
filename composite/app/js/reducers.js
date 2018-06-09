import * as THREE from 'three';
import * as actions from './actions.js';
import * as InputMatrices from './components/input-matrices.js';

const identityFrame = new THREE.Matrix4().identity();
const defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        number: '',
    },
    frame: identityFrame,
    value: '0',
    type: InputMatrices.DefaultMatrix,
    globals: [identityFrame],
    locals: [identityFrame],
    intermediates: [identityFrame],
    order: actions.operationOrders.GLOBAL_ORDER,
    stack: [],
};

function updateType(newState) {
    const {value} = newState;
    const type = {
        '0': InputMatrices.DefaultMatrix,
        '1': InputMatrices.RotationMatrix,
        '2': InputMatrices.ScaleMatrix,
        '3': InputMatrices.TranslationMatrix,
        '4': InputMatrices.ManualMatrix,
    }[value];
    Object.assign(newState, {type});
    return resetMatrix(newState);
}

function updateGlobals(newState) {
    const last = newState.stack[newState.stack.length - 1] || defaultState;
    const globals = [...last.globals];

    if (!identityFrame.equals(newState.frame)) {
        const newLength = globals.push(newState.frame.clone());
        globals[newLength - 1].multiply(globals[newLength - 2]);
    }

    return Object.assign(newState, {globals});
}

function updateLocals(newState) {
    const reducer = (locals, currentValue) => {
        const last = locals.push(identityFrame.clone()) - 1;
        locals[last].multiplyMatrices(locals[last - 1], currentValue);
        return locals;
    }

    let stack = newState.stack;

    if (identityFrame.equals(newState.frame)) {
        stack = stack.slice(0);
    } else {
        stack = stack.concat([newState]);
    }

    const locals = stack
        .map((state) => state.frame)
        .reverse()
        .reduce(reducer, defaultState.locals.slice(0));
    return Object.assign(newState, {locals});
}

function updateOrder(newState) {
    switch (newState.order) {
        case actions.operationOrders.GLOBAL_ORDER:
            newState.intermediates = newState.globals;
            break;
        case actions.operationOrders.LOCAL_ORDER:
            newState.intermediates = newState.locals;
            break;
    }

    return newState;
}

function updateIntermediates(newState) {
    updateGlobals(newState);
    updateLocals(newState);
    updateOrder(newState);
    return newState;
}

function updateFrame(newState) {
    const {matrix} = newState;
    const frame = new THREE.Matrix4().set(
        matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
        matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );
    Object.assign(newState, {frame});
    return updateIntermediates(newState);
}

function stackPush(state) {
    if (identityFrame.equals(state.frame)) return state;
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
    Object.assign(newState, {stack});
    return updateIntermediates(newState);
}

function resetMatrix(newState) {
    const {matrix} = defaultState;
    Object.assign(newState, {matrix});
    return updateFrame(newState);
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case actions.types.UPDATE_VALUE: {
            const {value} = action;
            return updateType({...state, value});
        };
        case actions.types.UPDATE_ORDER: {
            const {order} = action;
            return updateOrder({...state, order});
        };
        case actions.types.SET_MATRIX: {
            const matrix = {...state.matrix, ...action.matrix};
            return updateFrame({...state, matrix});
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
