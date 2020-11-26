import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { buildWorld, buildUpdateables } from "./components/buildWorld.js";

import { OrbitControls } from "./systems/OrbitControls.js";

// Module-scoped variables to prevent access from outside module
let camera;
let scene;
let renderer;
let loop;
let meshes;
let updateables;

class World {
  // Constructor to initialize three.js world
  constructor(canvasContainer) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    canvasContainer.append(renderer.domElement);

    // Create orbital controls
    const controls = new OrbitControls(camera, canvasContainer);

    // Create directional and hemisphere lights and add to scene
    const { directionalLight, hemisphereLight } = createLights();
    scene.add(directionalLight, hemisphereLight);

    // Resize canvas
    const resizer = new Resizer(canvasContainer, camera, renderer);

    // Initialize hook in resizer
    // resizer.onResize = () => {
    //   // Render a new single frame if resize detected
    //   this.render();
    // };

    // Build world meshes (stored in an array) and add to scene
    updateables = buildUpdateables();
    meshes = [...buildWorld(), ...updateables];
    if (meshes && Array.isArray(meshes)) {
      meshes.forEach((mesh) => {
        scene.add(mesh);
      });
    }
  }

  render(freqArray) {
    if (updateables && Array.isArray(updateables)) {
      updateables.forEach((mesh) => {
        mesh.update(freqArray);
      });
    }

    renderer.render(scene, camera);
  }
}

export { World };
