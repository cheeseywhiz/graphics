export const types = {
    UPDATE_NUMBER: 'UPDATE_NUMBER',
    UPDATE_MATRIX: 'UPDATE_MATRIX',
    SET_MATRIX: 'SET_MATRIX',
    UPDATE_VALUE: 'UPDATE_VALUE',
    RESET_MATRIX: 'RESET_MATRIX',
};

export function updateNumber(number) {
    const type = types.UPDATE_NUMBER;
    return {type, number};
}

export function updateMatrix(key, value) {
    const type = types.UPDATE_MATRIX;
    return {type, key, value};
}

export function setMatrix(matrix) {
    const type = types.SET_MATRIX;
    return {type, matrix};
}

export function updateValue(value) {
    const type = types.UPDATE_VALUE;
    return {type, value};
}

export function resetMatrix() {
    const type = types.RESET_MATRIX;
    return {type};
}
