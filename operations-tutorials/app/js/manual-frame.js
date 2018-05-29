import * as THREE from 'three';

class ManualFrame {
    constructor() {
        this.xi = this.addElement('manual-xi');
        this.yi = this.addElement('manual-yi');
        this.xj = this.addElement('manual-xj');
        this.yj = this.addElement('manual-yj');
        this.matrix = new THREE.Matrix4();
    }

    addElement(id) {
        var element = document.getElementById(id);
        element.addEventListener('change', ev => this.updateMatrix());
        element.addEventListener('change', ev => element.blur());
        return element;
    }

    updateMatrix() {
        this.matrix.set(
            parseFloat(this.xi.value), parseFloat(this.yi.value), 0, 0,
            parseFloat(this.xj.value), parseFloat(this.yj.value), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }
}

export default class ManualFrameChild extends ManualFrame {
    constructor(parent) {
        super();
        this.parent = parent;
    }

    updateMatrix() {
        super.updateMatrix();
        this.parent.updateManualFrame();
    }
}
