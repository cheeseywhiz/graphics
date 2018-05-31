import AutoSquareBuffer from './square-buffer';

export default class ManualSquareBuffer extends AutoSquareBuffer {
    constructor() {
        super();
        this.xi = this.addTextInput('manual-xi');
        this.yi = this.addTextInput('manual-yi');
        this.xj = this.addTextInput('manual-xj');
        this.yj = this.addTextInput('manual-yj');
    }

    update() {
        this.frame.set(
            parseFloat(this.xi.value), parseFloat(this.yi.value), 0, 0,
            parseFloat(this.xj.value), parseFloat(this.yj.value), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }
}
