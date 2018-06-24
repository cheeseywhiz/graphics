import * as THREE from 'three';

export default class Frame extends THREE.Matrix4 {
    updateVectors() {
        const te = this.elements;
        this.iHat = new THREE.Vector3(te[0], te[1], te[2], te[3]);
        this.jHat = new THREE.Vector3(te[4], te[5], te[6], te[7]);
        this.kHat = new THREE.Vector3(te[8], te[9], te[10], te[11]);
        this.origin = new THREE.Vector3(te[12], te[13], te[14], te[15]);
        return this;
    }

    set(
        xi, yi, zi, ox,
        xj, yj, zj, oy,
        xk, yk, zk, oz,
        xh, yh, zh, oh,
    ) {
        super.set(
            xi, yi, zi, ox,
            xj, yj, zj, oy,
            xk, yk, zk, oz,
            xh, yh, zh, oh,
        );
        this.updateVectors();
        return this;
    }

    multiplyMatrices(a, b) {
        super.multiplyMatrices(a, b);
        this.updateVectors();
        return this;
    }

    fromArray(array) {
        super.fromArray(array);
        this.updateVectors();
        return this;
    }

    clone() {
        return new Frame().fromArray(this.elements);
    }

    isIdentity() {
        return this.equals(identityFrame);
    }
}

export const identityFrame = new Frame().identity();
