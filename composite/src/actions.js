export const types = {
    UPDATE_OPERATION: 'UPDATE_OPERATION',
    SET_MATRIX: 'SET_MATRIX',
    STACK_PUSH: 'STACK_PUSH',
    STACK_POP: 'STACK_POP',
    STACK_CLEAR: 'STACK_CLEAR',
    RESET_MATRIX: 'RESET_MATRIX',
    TOGGLE_GEOMETRY: 'TOGGLE_GEOMETRY',
    UPDATE_SHAPE: 'UPDATE_SHAPE',
};

export const operationNames = {
    DEFAULT: 'DEFAULT',
    ROTATION: 'ROTATION',
    SCALE: 'SCALE',
    TRANSLATION: 'TRANSLATION',
    MANUAL: 'MANUAL',
};

export const shapeNames = {
    DEFAULT: 'DEFAULT',
    SQUARE: 'SQUARE',
    UNIT_CIRCLE: 'UNIT_CIRCLE',
    KNOT: 'KNOT',
};

function updateOperation(operationName) {
    const type = types.UPDATE_OPERATION;
    return {type, operationName};
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

function toggleGeometry(value) {
    const type = types.TOGGLE_GEOMETRY;
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
    updateOperation, setMatrix, stackPush, stackPop, stackClear, resetMatrix,
    updateMatrix, setRotationMatrix, setScaleMatrix, toggleGeometry,
    updateShape,
};
export default actions;
