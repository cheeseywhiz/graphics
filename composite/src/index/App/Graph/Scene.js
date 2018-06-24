import * as THREE from 'three';
import zip from '../../../common/zip.js';
import {operationNames, } from '../../../actions.js';
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
        this.addArrow(frame.iHat, frame.origin, 0xff0000);
        this.addArrow(frame.jHat, frame.origin, 0x00ff00);
    }

    addIntermediateHelpers(operations, numbers, frames, changes) {
        zip(
            operations, numbers, frames, changes,
        ).forEach(([operation, number, frame, {initial, final}]) => {
            switch (operation) {
                case operationNames.TRANSLATION: {
                    const change = new THREE.Vector3().subVectors(
                        final.origin, initial.origin
                    );
                    this.addArrow(change, initial.origin, 0x0000ff);
                };
            }
        });
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
