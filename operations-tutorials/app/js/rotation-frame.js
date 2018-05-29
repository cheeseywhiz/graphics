import * as THREE from 'three';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
function round(number, precision) {
    var shift = function(number, exponent) {
        var numArray = ('' + number ).split('e');
        return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + exponent) : exponent));
    }
    return shift(Math.round(shift(number, +precision)), -precision);
}

function roundFloatStr(number) {
    return round(number, 2).toString();
}

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

class RotationMatrix {
    constructor() {
        this.xi = document.getElementById('rotation-xi');
        this.yi = document.getElementById('rotation-yi');
        this.xj = document.getElementById('rotation-xj');
        this.yj = document.getElementById('rotation-yj');
        this.angle = document.getElementById('angle');
        this.angle.addEventListener('change', ev => this.update());
        this.angle.addEventListener('change', ev => this.angle.blur());
        this.matrix = new THREE.Matrix4();
    }

    update() {
        var angle = parseFloat(this.angle.value) * Math.PI / 180;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var xi = cos;
        var yi = -sin;
        var xj = sin;
        var yj = cos;
        this.xi.value = roundFloatStr(xi);
        this.yi.value = roundFloatStr(yi);
        this.xj.value = roundFloatStr(xj);
        this.yj.value = roundFloatStr(yj);
        this.matrix.set(
            xi, yi, 0, 0,
            xj, yj, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }
}

export default class RotationFrame extends RotationMatrix {
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
