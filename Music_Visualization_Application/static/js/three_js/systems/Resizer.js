const setSize = (canvasContainer, camera, renderer) => {
  // Set camera aspect ratio
  camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;

  // Update camera projection matrix (frustum)
  camera.updateProjectionMatrix();

  // Update size of renderer
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

  // Set pixel ratio
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(canvasContainer, camera, renderer) {
    // Set size on initialization
    setSize(canvasContainer, camera, renderer);

    window.addEventListener("resize", () => {
      // Set size whenever a window resize event fires
      setSize(canvasContainer, camera, renderer);

      // Call onResize hook
      this.onResize();
    });
  }

  // Hook to be initialized by World
  onResize() {}
}

export { Resizer };
