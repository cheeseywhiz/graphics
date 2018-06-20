import * as THREE from 'three';
import {shapeNames, } from '../../../actions.js';
import zip from '../common/zip.js';

function SquareBuffer(frame) {
    const buffer = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,

        0, 0, 0,
        1, 1, 0,
        0, 1, 0,

        1, 1, 0,
        1, 0, 0,
        0, 0, 0,

        0, 1, 0,
        1, 1, 0,
        0, 0, 0,
    ]);
    buffer.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    buffer.applyMatrix(frame);
    return buffer;
}

const shapes = {
    Default: undefined, SquareBuffer,
};
export default shapes;

export function getShape(shapeName) {
    const names = Object.values(shapeNames);
    const shapeFuncs = Object.values(shapes);
    const map = {};
    zip(names, shapeFuncs).forEach(([name, value]) => {
        map[name] = value;
    });
    return map[shapeName];
}
