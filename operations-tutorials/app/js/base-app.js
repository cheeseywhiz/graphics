import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

export default class BaseApp {
    constructor(id) {
        this.ratio = 4 / 3;
        this.canvas = document.getElementById(id);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(55, this.ratio, 0.00001, 1000);
        this.camera.position.z = 10;

        this.tracker = new TrackballControls(this.camera);
        this.tracker.rotateSpeed = 2.0;
        this.tracker.noZoom = false;
        this.tracker.noPan = false;

        window.addEventListener('resize', () => this.resizeHandler());
        this.resizeHandler();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.render());
    }

    resizeHandler() {
        let w = window.innerWidth - 16;
        let h = w / this.ratio;

        if (this.canvas.offsetTop + h > window.innerHeight) {
            h = window.innerHeight - this.canvas.offsetTop - 16;
            w = this.ratio * h;
        }

        this.canvas.width = w;
        this.canvas.height = h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.tracker.handleResize();
    }
}
