import * as THREE from 'three';
import starMap from './assets/textures/stars_milky_way.jpg';
import sunMap from './assets/textures/sun.jpg';

export function createEnvironment(scene, loader) {
    // 1. Tạo bầu trời sao (Skybox/Starfield) bằng hình ảnh
    const starGeometry = new THREE.SphereGeometry(600, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: loader.load(starMap),
        side: THREE.BackSide, // Hiển thị mặt trong của quả cầu (vì camera nằm ở giữa)
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);

    // 2. Tạo Mặt Trời
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: loader.load(sunMap),
    });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 64, 64), sunMaterial);
    sunMesh.position.set(-150, 60, -150);
    scene.add(sunMesh);

    // 3. Tạo ánh sáng Mặt Trời
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.copy(sunMesh.position);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    return { sunMesh, sunLight, starMesh };
}
