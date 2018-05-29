import { mat4 } from "gl-matrix";

export default class ManualFrame {
    constructor() {
        this.xi = this.addElement('manual-frame-xi');
        this.yi = this.addElement('manual-frame-yi');
        this.xj = this.addElement('manual-frame-xj');
        this.yj = this.addElement('manual-frame-yj');
        this.updateMatrix();
    }

    addElement(id) {
        var element = document.getElementById(id);
        element.addEventListener('onchange', this.updateMatrix);
        return element;
    }

    updateMatrix(ev) {
        this.matrix = mat4.fromValues(
            this.xi.value, this.yi.value, 0, 0,
            this.xj.value, this.yj.value, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }
}
