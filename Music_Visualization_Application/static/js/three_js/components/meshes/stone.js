import {
  BoxBufferGeometry,
  MeshToonMaterial,
  FrontSide,
  Mesh,
} from "../../three.module.js";

const colors = [0x4d5656, 0x515a5a, 0x616a6b];
const dimensions = [10, 10, 10]; // dimensions represented as [x, y, z]

function createStone(x, y, z) {
  // Create stone geometry
  const geometry = new BoxBufferGeometry(...dimensions);

  const material = new MeshToonMaterial({
    // Get a random color from colors[] array
    color: colors[Math.floor(Math.random() * colors.length)],
    side: FrontSide,
  });

  // Create stone mesh
  const stone = new Mesh(geometry, material);

  // Position stone mesh
  stone.position.set(x, y, z);

  return stone;
}

export { createStone };
