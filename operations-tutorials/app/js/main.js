import * as THREE from 'three';
import BaseApp from './base-app';
import ManualFrameChild from './manual-frame';
import RotationFrameChild from './rotation-frame';

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

export default class App extends BaseApp {
    constructor() {
        super('three-canvas');
        this.blueUndo = new THREE.Matrix4().identity();
        this.blueSquare = this.addSquare(0x0000ff);
        this.rotation_frame = new RotationFrameChild(this);

        this.redUndo = new THREE.Matrix4().identity();
        this.redSquare = this.addSquare(0xff0000);
        this.manual_frame = new ManualFrameChild(this);

        this.manual_frame.updateMatrix();
        this.rotation_frame.updateMatrix();
        this.resizeHandler();
        this.render();
    };

    addSquare(face_color) {
        var square = squareBufferGeom();
        const face_material = new THREE.MeshBasicMaterial({color: face_color, opacity: 0.75, transparent: true});
        const wire_material = new THREE.MeshBasicMaterial({color: 0x14ae6e, wireframeLinewidth: 3, wireframe: true});
        var face_mesh = new THREE.Mesh(square, face_material);
        var wire_mesh = new THREE.Mesh(square, wire_material);
        this.scene.add(face_mesh);
        this.scene.add(wire_mesh);
        return square;
    }

    updateFrame(undo, square, frame) {
        square.applyMatrix(undo);
        undo.getInverse(frame.matrix);

        if (frame.matrix.determinant()) {
            square.applyMatrix(frame.matrix);
        }
    }

    updateManualFrame() {
        this.updateFrame(this.redUndo, this.redSquare, this.manual_frame);
    }

    updateRotationFrame() {
        this.updateFrame(this.blueUndo, this.blueSquare, this.rotation_frame);
    }
}
