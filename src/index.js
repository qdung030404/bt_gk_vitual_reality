import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initScene } from './scene.js';
import { createEarth } from './earth.js';
import { createEnvironment } from './environment.js';
import { setupVR, handleVRInteraction } from './vr-controls.js';

// 1. Scene & Setup
const { scene, camera, renderer } = initScene();
const loader = new THREE.TextureLoader();

// 2. Camera Dolly 
const dolly = new THREE.Group();
dolly.add(camera);
scene.add(dolly);

// 3. Earth Model
const earth = createEarth(loader);
scene.add(earth.earthGroup);

// 4. Environment (Sun & Stars)
const env = createEnvironment(scene, loader);

// 5. Controls
new OrbitControls(camera, renderer.domElement);

let rotationMultiplier = 1;
setupVR(renderer, dolly, () => {
    rotationMultiplier = (rotationMultiplier === 1) ? 0 : 1;
    console.log("VR Interaction: Toggle Rotation", rotationMultiplier);
});

// 5.5. Speed Slider UI
let globalSpeed = 1;
const sliderContainer = document.createElement('div');
sliderContainer.style.position = 'absolute';
sliderContainer.style.bottom = '80px'; // Nằm trên nút Enter VR
sliderContainer.style.left = '50%';
sliderContainer.style.transform = 'translateX(-50%)';
sliderContainer.style.display = 'flex';
sliderContainer.style.flexDirection = 'column';
sliderContainer.style.alignItems = 'center';
sliderContainer.style.background = 'rgba(0, 0, 0, 0.6)';
sliderContainer.style.padding = '10px 20px';
sliderContainer.style.borderRadius = '10px';
sliderContainer.style.color = 'white';
sliderContainer.style.fontFamily = 'system-ui, sans-serif';
sliderContainer.style.zIndex = '999';

const sliderLabel = document.createElement('label');
sliderLabel.innerText = 'Tốc độ quay: 1x';
sliderLabel.style.marginBottom = '8px';
sliderLabel.style.fontSize = '14px';

const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '0';
speedSlider.max = '5';
speedSlider.step = '0.1';
speedSlider.value = '1';
speedSlider.style.cursor = 'pointer';

speedSlider.addEventListener('input', (e) => {
    globalSpeed = parseFloat(e.target.value);
    sliderLabel.innerText = `Tốc độ quay: ${globalSpeed}x`;
});

sliderContainer.appendChild(sliderLabel);
sliderContainer.appendChild(speedSlider);
document.body.appendChild(sliderContainer);

// 6. Animation Loop
function animate() {
    handleVRInteraction(renderer, camera, dolly, earth.earthGroup);

    const currentSpeed = rotationMultiplier * globalSpeed;

    earth.earthGroup.rotation.y += 0.001 * currentSpeed;
    earth.earthMesh.rotation.y += 0.002 * currentSpeed;
    earth.lightMesh.rotation.y += 0.002 * currentSpeed;
    earth.cloudMesh.rotation.y += 0.0023 * currentSpeed;
    earth.glowMesh.rotation.y += 0.002 * currentSpeed;
    env.sunMesh.rotation.y += 0.001 * currentSpeed;

    if (earth.moonGroup) {
        earth.moonGroup.rotation.y += 0.005 * currentSpeed; // Mặt trăng quay quanh Trái đất
        earth.moonMesh.rotation.y += 0.002 * currentSpeed; // Mặt trăng tự quay quanh trục
    }

    earth.lightsMat.uniforms.uSunPos.value.copy(env.sunMesh.position);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
