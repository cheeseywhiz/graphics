import * as THREE from 'three';
import zip from '../../common/zip.js';
import {operationNames, } from '../../actions.js';
import Frame, {identityFrame, } from '../common/Frame.js';
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

    addFrame(frame, color, shapeName, drawVectors) {
        const shapeFunc = getShape(shapeName);

        if (shapeFunc) {
            const buffer = shapeFunc();
            buffer.applyMatrix(frame);
            this.addGeometry(buffer, color);
        }

        if (drawVectors) this.addArrows(frame);
    }

    addSector(radius, startAngle, endAngle, center) {
        console.table({startAngle, endAngle});
        const buffer = new THREE.CircleBufferGeometry(
            radius, 4, startAngle, endAngle - startAngle,
        );
        const {x, y, z} = center;
        const frame = new Frame().makeTranslation(x, y, z);
        buffer.applyMatrix(frame);
        this.addGeometry(buffer, 0x000000);
    }

    addRotation(initial, final, center) {
        // arguments are all vectors
        const {radius, phi} = initial.spherical();
        this.addSector(
            radius,
            phi,
            final.spherical().phi,
            center,
        );
    }

    addGlobalRotation(initial, final) {
        this.addRotation(
            initial.origin,
            final.origin,
            identityFrame.origin,
        );
    }

    addLocalRotation(initial, final) {
        this.addRotation(
            initial.iHat,
            final.iHat,
            initial.origin,
        );
    }

    addTranslation(initial, final) {
        const change = new THREE.Vector3().subVectors(
            final.origin, initial.origin
        );
        this.addArrow(change, initial.origin, 0x0000ff);
    }

    addGlobalHelper(operation, initial, final) {
        switch (operation) {
            case operationNames.ROTATION:
                (identityFrame.origin.equals(initial.origin)
                    ? this.addLocalRotation.bind(this)
                    : this.addGlobalRotation.bind(this)
                )(initial, final);
                break;
            case operationNames.TRANSLATION:
                this.addTranslation(initial, final);
                break;
        }
    }

    addLocalHelper(operation, initial, final) {
        switch (operation) {
            case operationNames.ROTATION:
                this.addLocalRotation(initial, final);
                break;
            case operationNames.TRANSLATION:
                this.addTranslation(initial, final);
                break;
        }
    }

    helpersAdder(addHelper) {
        return (operations, changes) => {
            zip(operations, changes)
                .forEach(([operation, [initial, final]]) => {
                    addHelper(operation, initial, final);
                });
        };
    }

    addGlobalHelpers = this.helpersAdder(this.addGlobalHelper.bind(this));
    addLocalHelpers = this.helpersAdder(this.addLocalHelper.bind(this));
}
