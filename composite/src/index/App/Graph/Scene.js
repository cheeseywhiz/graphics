import * as THREE from 'three';
import {getShape, } from './shapes.js';

export default class Scene extends THREE.Scene {
    clear() {
        this.remove(...this.children.reverse());
    }

    addGeometry(geometry, color = 0xff8c00) {
        const faceMaterial = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0.75,
        });
        faceMaterial.side = THREE.DoubleSide;
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x14ae6e, wireframe: true, wireframeLinewidth: 3,
        });
        const faceMesh = new THREE.Mesh(geometry, faceMaterial);
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        this.add(faceMesh);
        this.add(wireMesh);
        return geometry;
    }

    addArrow(vector, origin, color) {
        const arrow = new THREE.ArrowHelper(
            vector.clone().normalize(),
            origin,
            vector.length(),
            color,
            1 / 3,
            1 / 3,
        );
        arrow.line.material.linewidth = 3;
        this.add(arrow);
    }

    addArrows(frame) {
        const elements = frame.elements;
        const i_hat = new THREE.Vector3(elements[0], elements[1], 0);
        const j_hat = new THREE.Vector3(elements[4], elements[5], 0);
        const origin = new THREE.Vector3(elements[12], elements[13], 0);
        this.addArrow(i_hat, origin, 0xff0000);
        this.addArrow(j_hat, origin, 0x00ff00);
    }

    addFrame(frame, color, shapeName, drawVectors) {
        const shapeFunc = getShape(shapeName);

        if (shapeFunc) {
            const buffer = shapeFunc();
            buffer.applyMatrix(frame);
            this.addGeometry(buffer, color);
        }

        if (drawVectors) this.addArrows(frame);
    }
}
