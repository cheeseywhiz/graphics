import * as THREE from 'three';
import zip from '../../common/zip.js';
import {operationNames, } from '../../actions.js';
import selectors from '../common/selectors.js';
import Frame, {identityFrame, } from '../common/Frame.js';
import {getShape, } from './shapes.js';

const palette = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    black: 0x000000,
    white: 0xffffff,
    orange: 0xff7f00,
    gray: 0x14ae6e,
};

export const colors = {
    iHat: palette.red,
    jHat: palette.green,
    first: palette.black,
    last: palette.white,
    globals: palette.red,
    locals: palette.blue,
    rotation: palette.black,
    scale: palette.orange,
    translation: palette.blue,
    wire: palette.gray,
};

// [a, b, c, d] => [[a, b], [b, c], [c, d]]
function consecutivePairs(array) {
    return array
        .slice(0, -1)
        .map((item, index) => [item, array[index + 1]]);
}

export default class Scene extends THREE.Scene {
    clear() {
        this.remove(...this.children.reverse());
    }

    addGeometry(geometry, color) {
        const faceMaterial = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0.75,
        });
        faceMaterial.side = THREE.DoubleSide;
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: colors.wire, wireframe: true, wireframeLinewidth: 3,
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
        this.addArrow(frame.iHat, frame.origin, colors.iHat);
        this.addArrow(frame.jHat, frame.origin, colors.jHat);
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
        const buffer = new THREE.CircleBufferGeometry(
            radius, 4, startAngle, endAngle - startAngle,
        );
        const {x, y, z} = center;
        const frame = new Frame().makeTranslation(x, y, z);
        buffer.applyMatrix(frame);
        this.addGeometry(buffer, colors.rotation);
    }

    addRotation(start, end, center) {
        const {radius, phi} = start.spherical();
        this.addSector(
            radius,
            phi,
            end.spherical().phi,
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

    addLine(start, end) {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(start);
        geometry.vertices.push(end);
        const material = new THREE.LineBasicMaterial({color: colors.scale});
        const line = new THREE.Line(geometry, material);
        this.add(line);
    }

    addScaleLine(initial, final, through, originFrame = identityFrame) {
        const start = originFrame.origin;
        const end = final.atVector(through)
        const axis = new THREE.Vector3()
            .subVectors(end, start)
            .normalize()
            .multiplyScalar(10);
        const axisEnd = start.clone().add(axis);
        this.addLine(start, axisEnd);
    }

    addGlobalScale(initial, final) {
        this.addScaleLine(initial, final, identityFrame.iHat);
        this.addScaleLine(initial, final, identityFrame.jHat);
        this.addScaleLine(initial, final, identityFrame.origin);
        this.addTranslation(initial, final);
    }

    addLocalScale(initial, final) {
        this.addScaleLine(initial, final, new THREE.Vector3(1, 1, 0), initial);
        this.addScaleLine(initial, final, identityFrame.iHat, initial);
        this.addScaleLine(initial, final, identityFrame.jHat, initial);
    }

    addTranslation(initial, final) {
        const change = new THREE.Vector3().subVectors(
            final.origin, initial.origin
        );
        this.addArrow(change, initial.origin, colors.translation);
    }

    addGlobalHelper(initial, final, operation) {
        if (identityFrame.origin.equals(initial.origin)) {
            return this.addLocalHelper(initial, final, operation);
        }

        switch (operation) {
            case operationNames.ROTATION:
                this.addGlobalRotation(initial, final);
                break;
            case operationNames.SCALE:
                this.addGlobalScale(initial, final);
                break;
            case operationNames.TRANSLATION:
                this.addTranslation(initial, final);
                break;
        }
    }

    addLocalHelper(initial, final, operation) {
        switch (operation) {
            case operationNames.ROTATION:
                this.addLocalRotation(initial, final);
                break;
            case operationNames.SCALE:
                this.addLocalScale(initial, final);
                break;
            case operationNames.TRANSLATION:
                this.addTranslation(initial, final);
                break;
        }
    }

    helpersAdder(addHelper) {
        return (intermediates, stack) => {
            const operations = stack.map(selectors.operation);
            zip(consecutivePairs(intermediates), operations)
                .forEach(([[initial, final], operation]) => {
                    addHelper(initial, final, operation);
                });
        };
    }

    addGlobalHelpers = this.helpersAdder(this.addGlobalHelper.bind(this));
    addLocalHelpers = this.helpersAdder(this.addLocalHelper.bind(this));
}
