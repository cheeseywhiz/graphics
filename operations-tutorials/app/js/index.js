import * as THREE from 'three';
import BaseApp from './base-app';
import ManualSquareBuffer from './manual';
import RotationSquareBuffer from './rotation';

export default class App extends BaseApp {
    constructor() {
        super('three-canvas');
        this.addGeometry(new RotationSquareBuffer(), 0x0000ff);
        this.addGeometry(new ManualSquareBuffer(), 0xff0000);
        this.resizeHandler();
        this.render();
    };

    addGeometry(geometry, faceColor) {
        var faceMaterial = new THREE.MeshBasicMaterial({color: faceColor, opacity: 0.75, transparent: true});
        var wireMaterial = new THREE.MeshBasicMaterial({color: 0x14ae6e, wireframeLinewidth: 3, wireframe: true});
        var face_mesh = new THREE.Mesh(geometry, faceMaterial);
        var wire_mesh = new THREE.Mesh(geometry, wireMaterial);
        this.scene.add(face_mesh);
        this.scene.add(wire_mesh);
        return geometry;
    }
}

document.addEventListener('DOMContentLoaded', ev => new App());
