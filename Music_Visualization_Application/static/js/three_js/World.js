import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { buildWorld, buildUpdateables } from "./components/buildWorld.js";

// import { OrbitControls } from "./systems/OrbitControls.js";

// Module-scoped variables to prevent access from outside module
let camera;
let scene;
let renderer;
let meshes;
let updateables;

class World {
  // Constructor to initialize three.js world
  constructor(canvasContainer) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    // Add the world to the canvas
    canvasContainer.append(renderer.domElement);

    // Create orbital controls
    // const controls = new OrbitControls(camera, canvasContainer);

    // Create directional and hemisphere lights and add to scene
    const { directionalLight, hemisphereLight } = createLights();
    scene.add(directionalLight, hemisphereLight);

    // Resize canvas
    const resizer = new Resizer(canvasContainer, camera, renderer);

    // Initialize hook in resizer
    resizer.onResize = () => {
      // Render a new single frame if resize detected
      this.renderStatic();
    };

    // Build world meshes (stored in an array) and add to scene
    updateables = buildUpdateables();
    meshes = [...buildWorld(), ...updateables];
    if (meshes && Array.isArray(meshes)) {
      meshes.forEach((mesh) => {
        scene.add(mesh);
      });
    }
  }

  // Render a single frame of only static (non-animating) meshes
  renderStatic() {
    renderer.render(scene, camera);
  }

  // Takes an array of frequency data from the song, passes it to the update method of each mesh in the updateables array before rendering a single frame of the scene
  renderUpdateables(freqArray) {
    if (updateables && Array.isArray(updateables)) {
      updateables.forEach((mesh) => {
        mesh.update(freqArray);
      });
    }

    // Render a single frame
    renderer.render(scene, camera);
  }

  // Takes a float representing opacity, sets all meshes to transparent, then increments opacity until 1.0 (opaque)
  renderOpacity(opacity) {
    meshes.forEach((mesh) => {
      // For grouped meshes, iterate through child meshes
      if (mesh.type === "Group") {
        mesh.children.forEach((childMesh) => {
          setTransparency(childMesh, opacity);
        });
      } else {
        setTransparency(mesh, opacity);
      }
    });

    // Render a single frame
    renderer.render(scene, camera);

    // Helper function to set both transparency and opacity of a mesh
    function setTransparency(mesh, opacity) {
      if (opacity < 1.0) {
        mesh.material.transparent = true;
        mesh.material.opacity = opacity;
      } else {
        mesh.material.transparent = false;
        mesh.material.opacity = 1.0; // 1.0 designates no transparency
      }
    }
  }
}

export { World };
