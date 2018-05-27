import * as THREE from 'three';
import BaseApp from './base-app';

export default class App extends BaseApp {
    constructor() {
        super();
        const dodecgeom = new THREE.DodecahedronGeometry(30);
        const face_material = new THREE.MeshBasicMaterial({color: 0xff8c00, opacity: 0.75, transparent: true});
        const wire_material = new THREE.MeshBasicMaterial({color: 0x14ae6e, wireframeLinewidth: 3, wireframe: true});
        const face_mesh = new THREE.Mesh(dodecgeom, face_material)
        const wire_mesh = new THREE.Mesh(dodecgeom, wire_material);
        this.scene.add(face_mesh);
        this.scene.add(wire_mesh);
    }
}
