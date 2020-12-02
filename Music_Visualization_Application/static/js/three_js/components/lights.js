// Import required classes from three.js
import { DirectionalLight, HemisphereLight } from "../three.module.js";

function createLights() {
  // Create a directional light, set shadow, and set position
  const directionalLight = new DirectionalLight(0xffffff, 0.7);
  directionalLight.castShadow = true;
  directionalLight.position.set(80, 120, 50);

  // Create hemisphere light and set position
  const hemisphereLight = new HemisphereLight(0xffffff, 0xb3858c, 0.65);
  hemisphereLight.position.set(10, 10, 10);

  return { directionalLight, hemisphereLight };
}

export { createLights };
