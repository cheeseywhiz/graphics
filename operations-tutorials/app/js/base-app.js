import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

export default class BaseApp {
    constructor(id) {
        this.ratio = window.innerWidth / window.innerHeight;
        this.canvas = document.getElementById(id);
        this.renderer =
            new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
        this.scene = new THREE.Scene();
        this.camera =
            new THREE.PerspectiveCamera(55, this.ratio, 0.00001, 1000);
        this.camera.position.z = 10;

        this.tracker = new TrackballControls(this.camera, this.canvas);
        this.tracker.noRotate = true;
        this.tracker.noZoom = true;
        this.tracker.noPan = true;

        window.addEventListener('resize', (ev) => this.resizeHandler());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.render());
    }

    resizeHandler() {
        this.ratio = window.innerWidth / window.innerHeight;
        let width = window.innerWidth;
        let height = width / this.ratio;

        if (this.canvas.offsetTop + height > window.innerHeight) {
            height = window.innerHeight - this.canvas.offsetTop;
            width = this.ratio * height;
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.camera.aspect = this.ratio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.tracker.handleResize();
    }
}
