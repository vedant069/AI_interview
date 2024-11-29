// src/components/3d/HumanFigure.ts
import * as THREE from '../../../node_modules/@types/three';

export const createHumanFigure = () => {
  const group = new THREE.Group();

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  head.position.y = 4;
  group.add(head);

  // Body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1.5, 4, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  body.position.y = 1;
  group.add(body);

  // Arms
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 3, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  rightArm.position.set(2, 2, 0);
  rightArm.rotation.z = Math.PI / 3;
  group.add(rightArm);

  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 3, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  leftArm.position.set(-2, 2, 0);
  leftArm.rotation.z = -Math.PI / 3;
  group.add(leftArm);

  // Legs
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 4, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  rightLeg.position.set(0.8, -1.5, 0);
  group.add(rightLeg);

  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 4, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })
  );
  leftLeg.position.set(-0.8, -1.5, 0);
  group.add(leftLeg);

  return group;
};