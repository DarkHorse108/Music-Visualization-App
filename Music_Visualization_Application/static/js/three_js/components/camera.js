// Import required class from three.js
import { PerspectiveCamera } from "../three.module.js";

// Set required properties for a camera
const fov = 100; // Field of view
const aspectRatio = 1; // Aspect ratio set to dummy value of 1
const nearClipping = 1; // How close objects can appear before they are clipped
const farClipping = 1000; // How far objects can appear before they are clipped
const positionArray = [65, 80, -60]; // Array elements represent [x, y, z]

function createCamera() {
  // Create three.js perspective camera
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
