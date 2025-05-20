import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Kamera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 13);

// Batas zoom

const scene = new THREE.Scene();

let bee;
let mixer;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('containerz3D').appendChild(renderer.domElement);

// GLTF Loader
const loader = new GLTFLoader();
loader.load('/fast_boy_in_quill.glb',
    function (gltf) {
        bee = gltf.scene;
        bee.scale.set(3, 3, 3);
        bee.position.set(-3, 2, 0);
        bee.rotation.set(7, 20, 0);
       
        bee.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
const action = mixer.clipAction(gltf.animations[0]);
action.timeScale = 0.1; // Ganti 0.3 sesuai kecepatan yang diinginkan
action.play();

        modelMove?.(); // Optional, your function if defined
    },
    function (xhr) {},
    function (error) {}
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(10, 10, 10);

scene.add(topLight);



// Render loop
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);

    if (bee && isMouseActive) {
        gsap.to(bee.rotation, {
            y: mouseX * Math.PI,
            x: mouseY * Math.PI / 4,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
};

reRender3D();
