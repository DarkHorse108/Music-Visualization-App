import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  Mesh,
} from "../../three.module.js";

const dimensions = [10, 10, 10]; // dimensions represented as [x, y, z]

function createCube() {
  // Create geometry of cube
  const geometry = new BoxBufferGeometry(...dimensions);
  const material = new MeshStandardMaterial({ color: "purple" });
  const cube = new Mesh(geometry, material);

  // Update mesh per frame
  cube.updateFrame = () => {
    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return cube;
}

export { createCube };
