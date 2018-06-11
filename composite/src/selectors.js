import * as THREE from 'three';
import {createSelector, } from 'reselect';
import {operationOrders, } from './actions.js';
import {InputMatrices, } from './index/App/InputMatrix.js';

const identityFrame = new THREE.Matrix4().identity();

const selectValue = (state) => state.value;
const selectMatrix = (state) => state.matrix;
const selectOrder = (state) => state.order;

const selectType = createSelector(
    selectValue,
    (value) => (
        {
            '0': InputMatrices.DefaultMatrix,
            '1': InputMatrices.RotationMatrix,
            '2': InputMatrices.ScaleMatrix,
            '3': InputMatrices.TranslationMatrix,
            '4': InputMatrices.ManualMatrix,
        }[value]
    ),
);
const selectFrame = createSelector(
    selectMatrix,
    (matrix) => (
        new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
            matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        )
    ),
);
const selectStack = createSelector(
    (state) => state.stack,
    (stack) => (
        stack.filter((state) => (
            !identityFrame.equals(selectFrame(state))
        ))
    ),
);
const selectStackFrames = createSelector(
    selectStack, selectFrame,
    (stack, frame) => {
        const stackFrames = stack.map(selectFrame);
        if (!identityFrame.equals(frame)) stackFrames.push(frame);
        return stackFrames;
    },
);
const selectGlobals = createSelector(
    selectStackFrames,
    (stackFrames) => {
        const reducer = (globals, currentValue) => {
            const newLength = globals.push(currentValue.clone());
            globals[newLength - 1].multiply(globals[newLength - 2]);
            return globals;
        };

        return stackFrames.reduce(reducer, [identityFrame]);
    },
);
const selectLocals = createSelector(
    selectStackFrames,
    (stackFrames) => {
        const reducer = (locals, currentValue) => {
            const newLength = locals.push(identityFrame.clone());
            locals[newLength - 1].multiplyMatrices(locals[newLength - 2], currentValue);
            return locals;
        }

        return stackFrames
            .reverse()
            .reduce(reducer, [identityFrame]);
    },
);
const selectIntermediates = createSelector(
    selectOrder, selectGlobals, selectLocals,
    (order, globals, locals) => (
        {
            [operationOrders.GLOBAL_ORDER]: globals,
            [operationOrders.LOCAL_ORDER]: locals,
        }[order]
    ),
);

export function doSubscriptions(state) {
    const subscriptions = [...doSubscriptions.subscriptions.values()];
    subscriptions.forEach((selector) => selector(state));
}
doSubscriptions.subscriptions = new Set();

function subscribe(...args) {
    const selector = createSelector(...args);
    doSubscriptions.subscriptions.add(selector);
    const unsubscribe = () => doSubscriptions.subscriptions.remove(selector);
    return unsubscribe;
}

const selectors = {
    value: selectValue,
    matrix: selectMatrix,
    order: selectOrder,
    stack: selectStack,
    type: selectType,
    frame: selectFrame,
    stackFrames: selectStackFrames,
    globals: selectGlobals,
    locals: selectLocals,
    intermediates: selectIntermediates,
    subscribe: subscribe,
};
export default selectors;
