export const types = {
    UPDATE_NUMBER: 'UPDATE_NUMBER',
};

export function updateNumber(number) {
    return {
        type: types.UPDATE_NUMBER,
        number: number,
    }
}
