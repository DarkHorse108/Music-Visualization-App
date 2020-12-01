import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  MeshToonMaterial,
  DoubleSide,
  Mesh,
} from "../../three.module.js";

const dimensions = [40, 55, 14]; // dimensions represented as [x, y, z]

function createWaterfall(x, y, z) {
  // Create waterfall geometry
  const geometry = new BoxBufferGeometry(...dimensions);

  // Create water material
  const material = new MeshToonMaterial({
    color: 0x6092c1,
    transparent: true,
    opacity: 0.4,
    side: DoubleSide,
  });

  // Create waterfall mesh
  const waterfall = new Mesh(geometry, material);

  // Position waterfall mesh
  waterfall.position.set(x, y, z);

  // Add .waterBlock boolean property to allow easier identification during iteration
  waterfall.waterBlock = true;

  return waterfall;
}

export { createWaterfall };
