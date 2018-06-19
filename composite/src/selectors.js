import * as THREE from 'three';
import {createSelector, } from 'reselect';
import {operationOrders, } from './actions.js';
import InputMatrices from './index/App/Stack/InputMatrices.js';

const identityFrame = new THREE.Matrix4().identity();

const selectValue = (state) => state.value;
const selectMatrix = (state) => state.matrix;
const selectOrder = (state) => state.order;

const selectInputMatrix = createSelector(
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
export function doSubscriptions(state) {
    const subscriptions = [...state.subscriptions.values()];
    subscriptions.forEach((selector) => selector(state));
}

const selectors = {
    value: selectValue,
    matrix: selectMatrix,
    order: selectOrder,
    stack: selectStack,
    InputMatrix: selectInputMatrix,
    frame: selectFrame,
    stackFrames: selectStackFrames,
    globals: selectGlobals,
    locals: selectLocals,
};
export default selectors;
