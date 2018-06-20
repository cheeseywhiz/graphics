import * as THREE from 'three';
import {shapeNames, } from '../../../actions.js';
import zip from '../common/zip.js';

function verticesToBuffer(vertices) {
    const buffer = new THREE.BufferGeometry();
    const typedVertices = new Float32Array(vertices);
    buffer.addAttribute('position', new THREE.BufferAttribute(typedVertices, 3));
    return buffer;
}

const SquareBuffer = () => verticesToBuffer([
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,

        0, 0, 0,
        1, 1, 0,
        0, 1, 0,
]);

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
