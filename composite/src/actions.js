export const types = {
    UPDATE_OPERATION: 'UPDATE_OPERATION',
    SET_MATRIX: 'SET_MATRIX',
    STACK_PUSH: 'STACK_PUSH',
    STACK_POP: 'STACK_POP',
    STACK_CLEAR: 'STACK_CLEAR',
    RESET_MATRIX: 'RESET_MATRIX',
    SELECTOR_SUBSCRIBE: 'SELECTOR_SUBSCRIBE',
    TOGGLE_ORDER: 'TOGGLE_ORDER',
    UPDATE_SHAPE: 'UPDATE_SHAPE',
};

export const operationTypes = {
    DEFAULT: 'DEFAULT',
    ROTATION: 'ROTATION',
    SCALE: 'SCALE',
    TRANSLATION: 'TRANSLATION',
    MANUAL: 'MANUAL',
};

export const shapeNames = {
    DEFAULT: 'DEFAULT',
    SQUARE: 'SQUARE',
};

function updateOperation(operationType) {
    const type = types.UPDATE_OPERATION;
    return {type, operationType};
}

function setMatrix(matrix) {
    const type = types.SET_MATRIX;
    return {type, matrix};
}

function stackPush() {
    const type = types.STACK_PUSH;
    return {type};
}

function stackPop() {
    const type = types.STACK_POP;
    return {type};
}

function stackClear() {
    const type = types.STACK_CLEAR;
    return {type};
}

function resetMatrix() {
    const type = types.RESET_MATRIX;
    return {type};
}

function selectorSubscribe(...funcs) {
    const type = types.SELECTOR_SUBSCRIBE;
    return {type, funcs};
}

function toggleOrder(value) {
    const type = types.TOGGLE_ORDER;
    return {type, value};
}

function updateShape(shapeName) {
    const type = types.UPDATE_SHAPE;
    return {type, shapeName};
}

function updateMatrix(key, value) {
    return setMatrix({[key]: value});
}

function setRotationMatrix(angle_degrees) {
    const angle_radians = angle_degrees * Math.PI / 180;
    const sin = Math.sin(angle_radians);
    const cos = Math.cos(angle_radians);
    const matrix = {
        xi: cos, yi: -sin, ox: 0,
        xj: sin, yj: cos, oy: 0,
        number: angle_degrees,
    };
    return setMatrix(matrix);
}

function setScaleMatrix(ratio) {
    const matrix = {
        xi: ratio, yi: 0, ox: 0,
        xj: 0, yj: ratio, oy: 0,
        number: ratio,
    };
    return setMatrix(matrix);
}

const actions = {
    updateOperation, setMatrix, stackPush, stackPop, stackClear,
    resetMatrix, updateMatrix, setRotationMatrix, setScaleMatrix,
    selectorSubscribe, toggleOrder, updateShape,
};
export default actions;
