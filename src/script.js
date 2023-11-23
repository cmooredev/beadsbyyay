import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

//group
const group = new THREE.Group();

scene.add(group);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

matcapTexture.colorSpace = THREE.SRGBColorSpace;

//Font Loader
const fontLoader = new FontLoader();
fontLoader.load("/fonts/Super Bubble_Regular.json", (font) => {
  const textGeometry = new TextGeometry("beadsbyyay", {
    font: font,
    size: 0.25,
    height: 0.2,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.016,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  const textGeometry2 = new TextGeometry("coming soon", {
    font: font,
    size: 0.15,
    height: 0.2,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.016,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox.min.x);
  //   -textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.02) * 0.5
  //   );

  textGeometry.center();
  textGeometry2.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  const text2 = new THREE.Mesh(textGeometry2, textMaterial);
  scene.add(text);
  scene.add(text2);
  text.position.y = 0.5;

  const donutGeometry = new THREE.SphereGeometry(0.2, 25, 25);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  for (let i = 0; i < 500; i++) {
    const sphere = new THREE.Mesh(donutGeometry, donutMaterial);
    sphere.position.x = (Math.random() - 0.5) * 100;
    sphere.position.y = (Math.random() - 0.5) * 100;
    sphere.position.z = (Math.random() - 0.5) * 1 - 20;

    const scale = Math.random() * 5;
    sphere.scale.set(scale, scale, scale);

    group.add(sphere);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = true;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 1.7;
controls.minPolarAngle = Math.PI / 2.3;
controls.minAzimuthAngle = -Math.PI * 0.07;
controls.maxAzimuthAngle = Math.PI * 0.07;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  for (let i = 0; i < group.children.length; i++) {
    const object = group.children[i];
    object.position.x = Math.sin(elapsedTime / 100 + i * 1) * 100;
  }
};

tick();
