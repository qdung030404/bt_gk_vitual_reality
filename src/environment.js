import * as THREE from 'three';

export function createEnvironment(scene, loader) {
    // 1. Tạo bầu trời sao (Skybox/Starfield) bằng hình ảnh
    const starGeometry = new THREE.SphereGeometry(600, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: loader.load('/src/assets/textures/stars_milky_way.jpg'),
        side: THREE.BackSide, // Hiển thị mặt trong của quả cầu (vì camera nằm ở giữa)
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);

    // 2. Tạo Mặt Trời
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: loader.load('/src/assets/textures/sun.jpg'),
    });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 64, 64), sunMaterial);
    sunMesh.position.set(-150, 60, -150);
    scene.add(sunMesh);

    // 3. Tạo ánh sáng Mặt Trời
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.copy(sunMesh.position);
    scene.add(sunLight);

    return { sunMesh, sunLight, starMesh };
}
