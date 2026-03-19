import * as THREE from 'three';

function getFresnelMat({ rimColor = 0x0088ff, facingColor = 0x000000 } = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimColor) },
    color2: { value: new THREE.Color(facingColor) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };
  const vs = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  void main() 
  {
    vNormal = normalize( normalMatrix * normal ); // getting components for our normals
    vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `;
  const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  void main() 
  {
    float fresnelTerm = fresnelBias + fresnelScale * pow( 1.0 + dot( vNormal, vPositionNormal ), fresnelPower );
    gl_FragColor = vec4( mix( color2, color1, fresnelTerm ), 1.0 );
  }
  `;
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  return fresnelMat;
}
export { getFresnelMat };
