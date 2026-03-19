import * as THREE from 'three';
import { getFresnelMat } from "./getFresnelMat.js";

export function createEarth(loader) {
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    // earthGroup.position.set(0, 1.2, -5);

    const detail = 12;
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    // 1. Earth Map
    const material = new THREE.MeshStandardMaterial({
        map: loader.load('/src/assets/textures/earth_daymap.jpg'),
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // 2. Night Lights Shader
    const lightsMat = new THREE.ShaderMaterial({
        uniforms: {
            uSunPos: { value: new THREE.Vector3() },
            uNightMap: { value: loader.load('/src/assets/textures/earth_nightmap.jpg') }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            varying vec2 vUv;
            uniform vec3 uSunPos;
            uniform sampler2D uNightMap;
            void main() {
                vec3 sunDir = normalize(uSunPos);
                float intensity = dot(vNormal, sunDir);
                vec3 nightColor = texture2D(uNightMap, vUv).rgb;
                float mask = smoothstep(0.1, -0.4, intensity);
                gl_FragColor = vec4(nightColor * mask, 1.0);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const lightMesh = new THREE.Mesh(geometry, lightsMat);
    lightMesh.scale.setScalar(1.002);
    earthGroup.add(lightMesh);

    // 3. Cloud Layer
    const cloudMat = new THREE.MeshStandardMaterial({
        map: loader.load('/src/assets/textures/earth_clouds.jpg'),
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(geometry, cloudMat);
    cloudMesh.scale.setScalar(1.005);
    earthGroup.add(cloudMesh);

    // 4. Fresnel Glow Overlay
    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    // 5. Thêm Mặt Trăng (Moon)
    const moonGroup = new THREE.Group();
    // kích thước mặt trăng khoảng bằng 1/4 trái đất nên để 0.27
    const moonGeometry = new THREE.IcosahedronGeometry(0.27, 12); 
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: loader.load('/src/assets/textures/moon.jpg'),
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    
    // Đặt khoảng cách mặt trăng cách tâm trái đất
    moonMesh.position.set(2.5, 0, 0); 
    
    moonGroup.add(moonMesh);
    earthGroup.add(moonGroup); // Thêm moonGroup vào earthGroup để nằm trong hệ thống Trái Đất

    return {
        earthGroup,
        earthMesh,
        lightMesh,
        cloudMesh,
        glowMesh,
        lightsMat,
        moonGroup,
        moonMesh
    };
}
