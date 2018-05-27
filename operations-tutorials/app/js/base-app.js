import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

export default class BaseApp {
    constructor() {
        this.ratio = 4 / 3;
        const mycanvas = document.getElementById('mycanvas');
        this.renderer = new THREE.WebGLRenderer({canvas: mycanvas, antialias: true});
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(55, this.ratio, 0.00001, 1000);
        this.camera.position.z = 100;

        this.tracker = new TrackballControls(this.camera);
        this.tracker = new TrackballControls(this.camera);
        this.tracker.rotateSpeed = 2.0;
        this.tracker.noZoom = false;
        this.tracker.noPan = false;

        window.addEventListener('resize', () => this.resizeHandler());
        this.resizeHandler();
        requestAnimationFrame(() => this.render());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.render());
    }

    resizeHandler() {
        const canvas = document.getElementById("mycanvas");
        let w = window.innerWidth - 16;
        let h = w / this.ratio;

        if (canvas.offsetTop + h > window.innerHeight) {
            h = window.innerHeight - canvas.offsetTop - 16;
            w = this.ratio * h;
        }

        canvas.width = w;
        canvas.height = h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.tracker.handleResize();
    }
}
