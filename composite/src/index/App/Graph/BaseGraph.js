import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import React from 'react';
import Scene from './BaseGraph/Scene.js';
import style from './BaseGraph/BaseGraph.css';

export default class BaseGraph extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.scene = new Scene();
    }

    componentDidMount() {
        this.updateRatio();
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.current, antialias: true});
        this.camera = new THREE.PerspectiveCamera(55, this.ratio, 0.00001, 1000);
        this.camera.position.z = 10;

        this.tracker = new TrackballControls(this.camera, this.canvas.current);
        this.tracker.noRotate = true;
        this.tracker.noZoom = true;
        this.tracker.noPan = true;

        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
        this.renderCanvas();
    }

    updateRatio() {
        this.ratio = window.innerWidth / window.innerHeight;
    }

    renderCanvas() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.renderCanvas());
    }

    handleResize() {
        this.updateRatio();
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
        return <div className={style.baseGraph}>
            <canvas ref={this.canvas} />
        </div>
    }
}
