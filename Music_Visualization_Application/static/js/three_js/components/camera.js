import { PerspectiveCamera } from "../three.module.js";

const fov = 100;
const aspectRatio = 1; // Aspect ratio set to dummy value of 1
const nearClipping = 1;
const farClipping = 1000;
const positionArray = [65, 65, -75]; // Array elements represent [x, y, z]

function createCamera() {
  const camera = new PerspectiveCamera(
    fov,
    aspectRatio,
    nearClipping,
    farClipping
  );

  // Spread positionArray as args to set x, y, z position
  camera.position.set(...positionArray);

  // Point camera to look at origin
  camera.lookAt(0, 0, 0);

  return camera;
}

export { createCamera };
