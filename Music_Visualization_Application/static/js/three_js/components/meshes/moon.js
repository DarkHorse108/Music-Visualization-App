import {
  Mesh,
  CircleBufferGeometry,
  MeshBasicMaterial,
} from "../../three.module.js";

function createMoon() {
  // One sided static 2D circle will be used for the moon
  let moonGeometry = new CircleBufferGeometry(10, 20);

  // Let's create a off-white, transparent material
  let moonMaterial = new MeshBasicMaterial({
    color: 0xffffff,
  });

  // Create the mesh
  let moonMesh = new Mesh(moonGeometry, moonMaterial);

  // Rotate the mesh so that it is facing the camera, then place it in the scene
  moonMesh.rotation.y += 2.5;
  moonMesh.position.set(-50, 80, 60);

  return moonMesh;
}

export { createMoon };
