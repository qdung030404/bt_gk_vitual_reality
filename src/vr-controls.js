import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

export function setupVR(renderer, dolly, onSelectCallback) {
    const controllerModelFactory = new XRControllerModelFactory();

    // Controllers
    const controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectCallback);
    dolly.add(controller1);

    const controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectCallback);
    dolly.add(controller2);

    // Grips
    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    dolly.add(controllerGrip1);

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    dolly.add(controllerGrip2);

    // Lasers
    const geometryLine = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0, -1)
    ]);
    const line = new THREE.Line(geometryLine);
    line.name = 'line';
    line.scale.z = 5;
    
    controller1.add(line.clone());
    controller2.add(line.clone());

    return { controller1, controller2 };
}

/**
 * Handle VR Interactions for Meta Quest
 * @param {THREE.WebGLRenderer} renderer 
 * @param {THREE.Camera} camera 
 * @param {THREE.Group} dolly - The camera rig
 * @param {THREE.Group} earthGroup - The simulation group to orbit
 */
export function handleVRInteraction(renderer, camera, dolly, earthGroup) {
    if (!renderer.xr.isPresenting) return;
    const session = renderer.xr.getSession();
    if (!session) return;
    
    for (const source of session.inputSources) {
        if (!source.gamepad) continue;
        const axes = source.gamepad.axes;
        
        // Horizontal: axes[2], Vertical: axes[3]
        
        // TAY TRÁI (Handedness === 'left'): ORBIT OX/OY
        if (source.handedness === 'left') {
            const rx = axes[2] || 0; // Joystick X
            const ry = axes[3] || 0; // Joystick Y
            
            // Xoay toàn bộ hệ thống mô phỏng
            earthGroup.rotation.y += rx * 0.04;
            earthGroup.rotation.x += ry * 0.04;
        }
        
        // TAY PHẢI (Handedness === 'right'): ZOOM (Dolly on Z)
        if (source.handedness === 'right') {
            const zoom = axes[3] || 0; // Joystick Y (lên/xuống)
            
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            
            // Dịch chuyển dolly theo hướng nhìn của camera
            dolly.position.addScaledVector(forward, -zoom * 0.1);
        }
    }
}
