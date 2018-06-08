export const types = {
    UPDATE_VALUE: 'UPDATE_VALUE',
    UPDATE_ORDER: 'UPDATE_ORDER',
    SET_MATRIX: 'SET_MATRIX',
    STACK_PUSH: 'STACK_PUSH',
    STACK_POP: 'STACK_POP',
    STACK_CLEAR: 'STACK_CLEAR',
    RESET_MATRIX: 'RESET_MATRIX',
};

export const operationOrders = {
    GLOBAL_ORDER: 'GLOBAL_ORDER',
    LOCAL_ORDER: 'LOCAL_ORDER',
};

export function updateValue(value) {
    const type = types.UPDATE_VALUE;
    return {type, value};
}

export function updateOrder(order) {
    const type = types.UPDATE_ORDER;
    return {type, order};
}

export function setMatrix(matrix) {
    const type = types.SET_MATRIX;
    return {type, matrix};
}

export function stackPush() {
    const type = types.STACK_PUSH;
    return {type};
}

export function stackPop() {
    const type = types.STACK_POP;
    return {type};
}

export function stackClear() {
    const type = types.STACK_CLEAR;
    return {type};
}

export function resetMatrix() {
    const type = types.RESET_MATRIX;
    return {type};
}

export function updateMatrix(key, value) {
    const matrix = {};
    matrix[key] = value;
    return setMatrix(matrix);
}

export function setRotationMatrix(angle_degrees) {
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

export function setScaleMatrix(ratio) {
    const matrix = {
        xi: ratio, yi: 0, ox: 0,
        xj: 0, yj: ratio, oy: 0,
        number: ratio,
    };
    return setMatrix(matrix);
}
