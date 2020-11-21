import {
  Group,
  BoxBufferGeometry,
  MeshToonMaterial,
  MeshStandardMaterial,
  FrontSide,
  Mesh,
} from "../../three.module.js";

const dirtColors = [0xe6a376, 0xeab28b];
const grassColors = [0x1e8449, 0x229954, 0x229954];

function createGrass(x, y, z) {
  // Create base geometry
  const baseGeometry = new BoxBufferGeometry(10, 8, 10);

  // Create base material
  const baseMaterial = new MeshToonMaterial({
    // Get a random color from colors[] array
    color: dirtColors[Math.floor(Math.random() * dirtColors.length)],
    side: FrontSide,
  });

  // Create base mesh
  const base = new Mesh(baseGeometry, baseMaterial);

  // Reposition base mesh
  base.position.set(0, 0, 0);

  // Create grass geometry
  const grassGeometry = new BoxBufferGeometry(10, 2, 10);

  // Create grass material
  const grassMaterial = new MeshStandardMaterial({
    // Get a random color from colors[] array
    color: grassColors[Math.floor(Math.random() * grassColors.length)],
    roughness: 1,
    metalness: 0,
  });

  // Create grass mesh
  const grass = new Mesh(grassGeometry, grassMaterial);

  // Reposition grass mesh
  grass.position.set(0, 5, 0);

  // Combine base and grass mesh into a grouped block mesh
  const grassBlock = new Group();
  grassBlock.add(base);
  grassBlock.add(grass);

  // Position grouped block mesh
  grassBlock.position.set(x, y, z);

  return grassBlock;
}

export { createGrass };
