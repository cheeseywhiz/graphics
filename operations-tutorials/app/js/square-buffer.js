import * as THREE from 'three';

export default class AutoSquareBuffer extends THREE.BufferGeometry {
    constructor() {
        super();
        this.frame = new THREE.Matrix4().identity();
        this.undo = new THREE.Matrix4().identity();
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
        this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    }

    addTextInput(id) {
        const element = document.getElementById(id);
        element.addEventListener('change', ev => element.blur());
        element.addEventListener('change', ev => this.onChange());
        return element;
    }

    onChange() {
        this.update();
        this.applyMatrix(this.undo);
        this.undo.getInverse(this.frame);
        if (this.frame.determinant()) this.applyMatrix(this.frame);
    }

    update() {}
}
