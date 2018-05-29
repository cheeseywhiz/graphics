import * as THREE from 'three';

function squareBufferGeom() {
    var square = new THREE.BufferGeometry();
    var vertices = new Float32Array([
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

class ManualMatrix {
    constructor() {
        this.xi = this.addElement('manual-xi');
        this.yi = this.addElement('manual-yi');
        this.xj = this.addElement('manual-xj');
        this.yj = this.addElement('manual-yj');
        this.matrix = new THREE.Matrix4();
    }

    addElement(id) {
        var element = document.getElementById(id);
        element.addEventListener('change', ev => this.update());
        element.addEventListener('change', ev => element.blur());
        return element;
    }

    update() {
        this.matrix.set(
            parseFloat(this.xi.value), parseFloat(this.yi.value), 0, 0,
            parseFloat(this.xj.value), parseFloat(this.yj.value), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }
}

export default class ManualFrame extends ManualMatrix {
    constructor() {
        super()
        this.undo = new THREE.Matrix4().identity();
        this.square = squareBufferGeom();
        this.update();
    }

    update() {
        super.update();
        this.square.applyMatrix(this.undo);
        this.undo.getInverse(this.matrix);

        if (this.matrix.determinant()) this.square.applyMatrix(this.matrix);
    }
}
