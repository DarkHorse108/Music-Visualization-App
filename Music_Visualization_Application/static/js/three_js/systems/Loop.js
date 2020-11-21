import { Clock } from "../three.module.js";

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.meshes = [];
  }

  // Function to render frames continuously
  start() {
    this.renderer.setAnimationLoop(() => {
      // Update a single frame for all meshes
      for (const mesh of this.meshes) {
        mesh.updateFrame();
      }

      // Render a single frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  // Function to pause rendering of frames
  stop() {
    // Pass null as parameter to stop animation loop
    this.renderer, setAnimationLoop(null);
  }
}

export { Loop };
