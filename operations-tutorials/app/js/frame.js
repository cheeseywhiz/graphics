import * as THREE from 'three';

function squareBufferGeom() {
    var square = new THREE.BufferGeometry();
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
    square.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return square;
}


export default class FrameBase {
    constructor() {
        this.matrix = new THREE.Matrix4().identity();
        this.undo = new THREE.Matrix4().identity();
        this.geom = squareBufferGeom();
    }

    addTextInput(id) {
        var element = document.getElementById(id);
        element.addEventListener('change', ev => element.blur());
        element.addEventListener('change', ev => this.onChange());
        return element;
    }

    onChange() {
        this.update();
        this.geom.applyMatrix(this.undo);
        this.undo.getInverse(this.matrix);

        if (this.matrix.determinant()) this.geom.applyMatrix(this.matrix);
    }

    update() {}
}
