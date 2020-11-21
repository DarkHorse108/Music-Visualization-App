import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  FrontSide,
  Mesh,
} from "../../three.module.js";

const colors = [0xe6a376, 0xeab28b];
const dimensions = [10, 10, 10]; // dimensions represented as [x, y, z]

function createDirt(x, y, z) {
  // Create dirt geometry
  const geometry = new BoxBufferGeometry(...dimensions);

  // Create dirt material
  const material = new MeshStandardMaterial({
    // Get a random color from colors[] array
    color: colors[Math.floor(Math.random() * colors.length)],
    side: FrontSide,
    roughness: 1,
    metalness: 0,
  });

  // Create dirt mesh
  const dirt = new Mesh(geometry, material);

  // Position dirt mesh
  dirt.position.set(x, y, z);

  return dirt;
}

export { createDirt };
