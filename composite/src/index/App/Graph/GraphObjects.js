import * as THREE from 'three';
import {getShape, } from './shapes.js';
import {colors, } from './Scene.js';

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

const GraphObjects = {
    geometry: addGeometry,
    arrow: addArrow,
    arrows: addArrows,
    frame: addFrame,
};
export default GraphObjects;
