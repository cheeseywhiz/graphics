import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import React from 'react';

export default class BaseGraph extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    setRatio() {
        this.ratio = window.innerWidth / window.innerHeight;
    }

    componentDidMount() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.current, antialias: true});
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(55, this.ratio, 0.00001, 1000);
        this.camera.position.z = 10;

        this.tracker = new TrackballControls(this.camera, this.canvas.current);
        this.tracker.noRotate = true;
        this.tracker.noZoom = true;
        this.tracker.noPan = true;

        window.addEventListener('resize', () => this.handleResize());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.render());
    }

    handleResize() {
        this.setRatio();
        let width = window.innerWidth;
        let height = width / this.ratio;

        if (this.canvas.current.offsetTop + height > window.innerHeight) {
            height = window.innerHeight - this.canvas.current.offsetTop;
            width = this.ratio * height;
        }

        this.canvas.current.width = width;
        this.canvas.current.height = height;
        this.canvas.current.aspect = this.ratio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.tracker.handleResize();
    }

    render() {
        return <canvas ref={this.canvas} />
    }
}
