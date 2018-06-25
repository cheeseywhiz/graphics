import * as THREE from 'three';
import zip, {range, } from '../../common/zip.js';
import {operationNames, } from '../../actions.js';
import selectors from '../common/selectors.js';
import {identityFrame, } from '../common/Frame.js';
import GraphObjects from './GraphObjects.js';

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
const consecutivePairs = (array) => range(array.length - 1)
    .map((index) => [array[index], array[index + 1]]);

const flatten = (array) => (
    array.reduce((accumulator, currentValue) => (
        Array.isArray(currentValue)
            ? accumulator.concat(flatten(currentValue))
            : accumulator.concat(currentValue)
    ), [])
);

export default class Scene extends THREE.Scene {
    clear() {
        this.remove(...this.children.reverse());
    }

    addAll(objects) {
        console.table(flatten([objects]))
        flatten([objects]).forEach((object) => this.add(object));
    }

    addGlobalRotation(initial, final) {
        return GraphObjects.rotation(
            initial.origin,
            final.origin,
            identityFrame.origin,
        );
    }

    addLocalRotation(initial, final) {
        return GraphObjects.rotation(
            initial.iHat,
            final.iHat,
            initial.origin,
        );
    }

    addScaleLine(initial, final, through, originFrame = identityFrame) {
        const start = originFrame.origin;
        const end = final.atVector(through);
        const axis = new THREE.Vector3()
            .subVectors(end, start)
            .normalize()
            .multiplyScalar(10);
        const axisEnd = start.clone().add(axis);
        return GraphObjects.line(start, axisEnd);
    }

    addGlobalScale(initial, final) {
        return [
            this.addScaleLine(initial, final, identityFrame.iHat),
            this.addScaleLine(initial, final, identityFrame.jHat),
            this.addScaleLine(initial, final, identityFrame.origin),
            this.addTranslation(initial, final),
        ];
    }

    addLocalScale(initial, final) {
        return [
            this.addScaleLine(initial, final, new THREE.Vector3(1, 1, 0), initial),
            this.addScaleLine(initial, final, identityFrame.iHat, initial),
            this.addScaleLine(initial, final, identityFrame.jHat, initial),
        ];
    }

    addTranslation(initial, final) {
        const change = new THREE.Vector3().subVectors(
            final.origin, initial.origin
        );
        return GraphObjects.arrow(change, initial.origin, colors.translation);
    }

    addGlobalHelper(initial, final, operation) {
        if (identityFrame.origin.equals(initial.origin)) {
            return this.addLocalHelper(initial, final, operation);
        }

        switch (operation) {
            case operationNames.ROTATION:
                return this.addGlobalRotation(initial, final);
            case operationNames.SCALE:
                return this.addGlobalScale(initial, final);
            case operationNames.TRANSLATION:
                return this.addTranslation(initial, final);
        }
    }

    addLocalHelper(initial, final, operation) {
        switch (operation) {
            case operationNames.ROTATION:
                return this.addLocalRotation(initial, final);
            case operationNames.SCALE:
                return this.addLocalScale(initial, final);
            case operationNames.TRANSLATION:
                return this.addTranslation(initial, final);
        }
    }

    helpersAdder(addHelper) {
        return (intermediates, stack) => {
            const operations = stack.map(selectors.operation);
            this.addAll(zip(consecutivePairs(intermediates), operations)
                .map(([[initial, final], operation]) => (
                    addHelper(initial, final, operation)
                ))
            );
        };
    }

    addGlobalHelpers = this.helpersAdder(this.addGlobalHelper.bind(this));
    addLocalHelpers = this.helpersAdder(this.addLocalHelper.bind(this));
}
