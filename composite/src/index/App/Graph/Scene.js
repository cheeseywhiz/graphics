import * as THREE from 'three';

export default class Scene extends THREE.Scene {
    clear() {
        this.remove.apply(this, this.children.reverse());
    }

    addGeometry(geometry) {
        const faceMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8c00, transparent: true, opacity: 0.75,
        });
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x14ae6e, wireframe: true, wireframeLinewidth: 3,
        });
        const faceMesh = new THREE.Mesh(geometry, faceMaterial);
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        this.add(faceMesh);
        this.add(wireMesh);
        return geometry;
    }
}
