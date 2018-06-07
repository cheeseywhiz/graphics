export const types = {
    UPDATE_NUMBER: 'UPDATE_NUMBER',
    UPDATE_MATRIX: 'UPDATE_MATRIX',
    SET_MATRIX: 'SET_MATRIX',
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
