import * as THREE from 'three';
import BaseApp from './base-app';
import ManualFrame from './manual-frame';
import RotationFrame from './rotation-frame';

export default class App extends BaseApp {
    constructor() {
        super('three-canvas');
        this.addFrame(new RotationFrame(), 0x0000ff);
        this.addFrame(new ManualFrame(), 0xff0000);
        this.resizeHandler();
        this.render();
    };

    addFrame(frame, face_color) {
        var face_material = new THREE.MeshBasicMaterial({color: face_color, opacity: 0.75, transparent: true});
        var wire_material = new THREE.MeshBasicMaterial({color: 0x14ae6e, wireframeLinewidth: 3, wireframe: true});
        var face_mesh = new THREE.Mesh(frame.geom, face_material);
        var wire_mesh = new THREE.Mesh(frame.geom, wire_material);
        this.scene.add(face_mesh);
        this.scene.add(wire_mesh);
        return frame;
    }
}
