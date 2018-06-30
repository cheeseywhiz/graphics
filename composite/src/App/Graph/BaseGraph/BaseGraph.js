import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import React from 'react';
import Scene from './Scene.js';

export default class BaseGraph extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.scene = new Scene();
    }

    componentDidMount() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.current, antialias: true});

        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;

        this.tracker = new TrackballControls(this.camera, this.canvas.current);
        this.tracker.noRotate = true;
        this.tracker.noZoom = true;
        this.tracker.noPan = true;

        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
        this.renderCanvas();
    }

    renderCanvas() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.renderCanvas());
    }

    getSize() {
        let width = window.innerWidth;
        let height = width / this.ratio;

        if (this.canvas.current.offsetTop + height > window.innerHeight) {
            height = window.innerHeight - this.canvas.current.offsetTop;
            width = this.ratio * height;
        }

        return {width, height};
    }

    updateCamera(width) {
        const height = width / this.ratio;
        this.camera.left = width / -2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = height / -2;
        this.camera.updateProjectionMatrix();
    }

    handleResize() {
        this.ratio = window.innerWidth / window.innerHeight;
        const {width, height} = this.getSize();
        this.canvas.current.width = width;
        this.canvas.current.height = height;
        this.canvas.current.aspect = this.ratio;
        this.updateCamera(20);
        this.renderer.setSize(width, height);
        this.tracker.handleResize();
    }

    render() {
        return <canvas ref={this.canvas} />
    }
}
