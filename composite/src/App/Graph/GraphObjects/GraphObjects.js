import * as THREE from 'three';
import {operationNames, } from '../../../common/actions.js';
import zip, {range, } from '../../../common/zip.js';
import Frame, {identityFrame, } from '../../common/Frame.js';
import selectors from '../../common/selectors.js';
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

function addGeometry(geometry, color = 0xff8c00) {
    const faceMaterial = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.75,
    });
    faceMaterial.side = THREE.DoubleSide;
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: colors.wire, wireframe: true, wireframeLinewidth: 3,
    });
    return [
        new THREE.Mesh(geometry, faceMaterial),
        new THREE.Mesh(geometry, wireMaterial),
    ];
}

function addArrow(vector, origin, color) {
    const arrow = new THREE.ArrowHelper(
        vector.clone().normalize(),
        origin,
        vector.length(),
        color,
        1 / 3,
        1 / 3,
    );
    arrow.line.material.linewidth = 3;
    return arrow;
}

function addArrows(frame) {
    return [
        addArrow(frame.iHat, frame.origin, colors.iHat),
        addArrow(frame.jHat, frame.origin, colors.jHat),
    ];
}

function addFrame(frame, color, shapeName, drawVectors) {
    const ret = [];
    const shapeFunc = getShape(shapeName);

    if (shapeFunc) {
        const buffer = shapeFunc();
        buffer.applyMatrix(frame);
        ret.push(addGeometry(buffer, color));
    }

    if (drawVectors) ret.push(addArrows(frame));
    return ret;
}

function addSector(radius, startAngle, endAngle, center) {
    const buffer = new THREE.CircleBufferGeometry(
        radius, 4, startAngle, endAngle - startAngle,
    );
    const {x, y, z} = center;
    const frame = new Frame().makeTranslation(x, y, z);
    buffer.applyMatrix(frame);
    return addGeometry(buffer, colors.rotation);
}

function addRotation(start, end, center) {
    const {radius, phi} = start.spherical();
    return addSector(
        radius,
        phi,
        end.spherical().phi,
        center,
    );
}

function addLine(start, end) {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(start);
    geometry.vertices.push(end);
    const material = new THREE.LineBasicMaterial({color: colors.scale});
    return new THREE.Line(geometry, material);
}

// [a, b, c, d] => [[a, b], [b, c], [c, d]]
const consecutivePairs = (array) => range(array.length - 1)
    .map((index) => [array[index], array[index + 1]]);

export class ChangeHelper {
    set(initial, final) {
        this.initial = initial;
        this.final = final;
        return this;
    }

    addGlobalRotation() {
        return addRotation(
            this.initial.origin,
            this.final.origin,
            identityFrame.origin,
        );
    }

    addLocalRotation() {
        return addRotation(
            this.initial.iHat,
            this.final.iHat,
            this.initial.origin,
        );
    }

    addGlobalScaleLine(through) {
        const start = identityFrame.origin;
        const end = this.final.atVector(through);
        return addLine(start, end);
    }

    addGlobalScale() {
        return [
            this.addGlobalScaleLine(identityFrame.iHat),
            this.addGlobalScaleLine(identityFrame.jHat),
            this.addTranslation(),
        ];
    }

    addLocalScaleLine(through) {
        const start = this.initial.origin;
        const end = this.final.atVector(through);
        const axis = new THREE.Vector3()
            .subVectors(end, start)
            .normalize()
            .multiplyScalar(30);
        const axisEnd = start.clone().add(axis);
        return addLine(start, axisEnd);
    }

    addLocalScale() {
        return [
            this.addLocalScaleLine(new THREE.Vector3(1, 1, 0)),
            this.addLocalScaleLine(identityFrame.iHat),
            this.addLocalScaleLine(identityFrame.jHat),
        ];
    }

    addTranslation() {
        const change = new THREE.Vector3().subVectors(
            this.final.origin, this.initial.origin
        );
        return addArrow(change, this.initial.origin, colors.translation);
    }

    addGlobalHelper(operation) {
        if (identityFrame.origin.equals(this.initial.origin)) {
            return this.addLocalHelper(operation);
        }

        switch (operation) {
            case operationNames.ROTATION:
                return this.addGlobalRotation();
            case operationNames.SCALE:
                return this.addGlobalScale();
            case operationNames.TRANSLATION:
                return this.addTranslation();
        }
    }

    addLocalHelper(operation) {
        switch (operation) {
            case operationNames.ROTATION:
                return this.addLocalRotation();
            case operationNames.SCALE:
                return this.addLocalScale();
            case operationNames.TRANSLATION:
                return this.addTranslation();
        }
    }
}

const [addGlobalHelpers, addLocalHelpers] = ((changeHelper) => (
    [changeHelper.addGlobalHelper, changeHelper.addLocalHelper]
        .map((func) => func.bind(changeHelper))
        .map((method) => ([initial, final]) => (operation) => {
            changeHelper.set(initial, final);
            return method(operation);
        })
        .map((getHelperAdder) => (intermediates, state) => (
            zip(
                consecutivePairs(intermediates).map(getHelperAdder),
                state.map(selectors.operation),
            ).map(([addHelper, operation]) => addHelper(operation))
        ))
))(new ChangeHelper());

const GraphObjects = {
    geometry: addGeometry,
    arrow: addArrow,
    arrows: addArrows,
    frame: addFrame,
    sector: addSector,
    rotation: addRotation,
    line: addLine,
    globalHelpers: addGlobalHelpers,
    localHelpers: addLocalHelpers,
};
export default GraphObjects;
