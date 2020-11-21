import { WebGLRenderer } from "../three.module.js";
import { PCFSoftShadowMap } from "../three.module.js";

function createRenderer() {
  // Create WebGL renderer and enable antialiasing for smoother visuals
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });

  // Enable physically correct lights
  renderer.physicallyCorrectLights = true;

  // Enable shadow maps
  renderer.shadowMap.enabled = true;

  // Set to soft shadow maps
  renderer.shadowMap.type = PCFSoftShadowMap;

  return renderer;
}

export { createRenderer };
