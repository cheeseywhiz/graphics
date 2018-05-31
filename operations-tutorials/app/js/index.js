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
        const faceMaterial = new THREE.MeshBasicMaterial({
            color: faceColor, opacity: 0.75, transparent: true,
        });
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x14ae6e, wireframeLinewidth: 3, wireframe: true,
        });
        const faceMesh = new THREE.Mesh(geometry, faceMaterial);
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        this.scene.add(faceMesh);
        this.scene.add(wireMesh);
        return geometry;
    }
}

document.addEventListener('DOMContentLoaded', (ev) => new App());
