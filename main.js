import "./style.css";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
const canvas_cont = document.querySelector("#canvas-cont");
renderer.setSize(canvas_cont.offsetWidth, canvas_cont.offsetHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Enable tone mapping for better HDR rendering
renderer.toneMappingExposure = 1;

renderer.setPixelRatio(window.devicePixelRatio);
const loader = new GLTFLoader();

let model;
loader.load("./public/earth.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
});

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./public/hdri2.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 3.8);

controls.update();

function animate() {
  window.requestAnimationFrame(animate);
  if (model) {
    model.rotation.x += 0.001;
    model.rotation.y += 0.001;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();
