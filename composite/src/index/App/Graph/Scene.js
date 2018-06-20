import * as THREE from 'three';
import {getShape, } from './shapes.js';

const round = (places) => {
    const mul = 10 ** places;
    return (num) => (
        Math.round(num * mul) / mul
    );
};

export default class Scene extends THREE.Scene {
    clear() {
        this.remove.apply(this, this.children.reverse());
    }

    addGeometry(geometry, color = 0xff8c00) {
        const faceMaterial = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0.75,
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

    addArrow(vector, origin, color) {
        const arrow = new THREE.ArrowHelper(
            vector,
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
        // rounded due to strange floating point error behavior otherwise
        const elements = frame.elements.map(round(16));
        const i_hat = new THREE.Vector3(elements[0], elements[1], 0);
        const j_hat = new THREE.Vector3(elements[4], elements[5], 0);
        // raised 1 / 3 to not over lap square
        const origin = new THREE.Vector3(elements[12], elements[13], 1 / 3);
        this.addArrow(i_hat, origin, 0xff0000);
        this.addArrow(j_hat, origin, 0x00ff00);
    }

    addFrame(frame, color, shapeName) {
        const shapeFunc = getShape(shapeName);

        if (shapeFunc) {
            const buffer = shapeFunc(frame);
            this.addGeometry(buffer, color);
        }

        this.addArrows(frame);
    }
}
