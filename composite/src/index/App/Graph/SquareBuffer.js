import * as THREE from 'three';

export default function SquareBuffer(frame) {
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
