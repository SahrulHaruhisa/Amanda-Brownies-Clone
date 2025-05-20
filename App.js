import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Kamera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 13);

const scene = new THREE.Scene();

let bee;
let mixer;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('container3D').appendChild(renderer.domElement);

// GLTF Loader
const loader = new GLTFLoader();
loader.load('/Untitled.glb',
    function (gltf) {
        bee = gltf.scene;
        bee.scale.set(4, 4, 4);
        bee.position.set(0, 0, 0);

        // Enable shadow
        bee.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
        mixer.clipAction(gltf.animations[0]).play();

        modelMove?.(); // Optional, your function if defined
    },
    function (xhr) {},
    function (error) {}
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(10, 10, 10);
topLight.castShadow = true;
topLight.shadow.mapSize.width = 1024;
topLight.shadow.mapSize.height = 1024;
scene.add(topLight);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.ShadowMaterial({ opacity: 0.3 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Mouse control toggle
let isMouseActive = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('click', () => {
    isMouseActive = !isMouseActive;
});

document.addEventListener('mousemove', (event) => {
    if (!isMouseActive) return;
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

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

// === Scroll-triggered Positioning ===
let arrPositionModel = [
    {
        class: 'banner',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 }
    },
    {
        class: 'banner2',
        position: { x: 0.1, y: -2.3, z: 0 },
        rotation: { x: 0, y: 3, z: 0 },
        scale: { x: 2, y: 2, z: 2 },
        
    },
];

// Fungsi pindah posisi/rotasi
function moveModelTo(config) {
    if (!bee) return;

    gsap.to(bee.position, {
        x: config.position.x,
        y: config.position.y,
        z: config.position.z,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.to(bee.rotation, {
        x: config.rotation.x,
        y: config.rotation.y,
        z: config.rotation.z,
        duration: 1,
        ease: 'power2.out'
    });
    gsap.to(bee.scale, {
        x: config.scale.x,
        y: config.scale.y,
        z: config.scale.z,
        duration: 1,
        ease: 'power2.out'
    });
}

// Observer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const modelConfig = arrPositionModel.find(item => item.class === entry.target.className);
            if (modelConfig) {
                moveModelTo(modelConfig);
            }
        }
    });
}, {
    threshold: 0.5
});

// Observe semua elemen berdasarkan array
arrPositionModel.forEach(cfg => {
    const el = document.querySelector(`.${cfg.class}`);
    if (el) observer.observe(el);
});
// Ambil elemen kartu
const card1 = document.getElementsByClassName('jumlah1');
const card2 = document.getElementsByClassName('jumlah2');
const card3 = document.getElementsByClassName('jumlah3');

// Fungsi animasi masuk
function animateCardsIn() {
  gsap.to(card1, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0 });
  gsap.to(card2, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.to(card3, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
}

// Fungsi animasi keluar
function animateCardsOut() {
  gsap.to(card1, { opacity: 0, x: -60, duration: 0.5, ease: 'power3.in' });
  gsap.to(card2, { opacity: 0, x: 60, duration: 0.5, ease: 'power3.in' });
gsap.to(card3, { opacity: 0, y: 30, x:32, duration: 0.5, ease: 'power3.in' });
}

// Inisialisasi posisi kartu (keluar layar)
gsap.set(card1, { x: -200 });
gsap.set(card2, { x: 200 });
gsap.set(card3, { x: 200 , y:-100});

// Tambahkan observer khusus banner2
const banner2El = document.querySelector('.banner2');
const bannerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCardsIn();
    } else {
      animateCardsOut();
    }
  });
}, { threshold: 0.5 });

bannerObserver.observe(banner2El);


