import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  MeshToonMaterial,
  FrontSide,
  Mesh,
} from "../../three.module.js";

function createWall(dimensions, position) {
  // Create wall geometry
  const geometry = new BoxBufferGeometry(...dimensions);

  // Create wall material
  const material = new MeshToonMaterial({
    color: 0xedbb99,
    side: FrontSide,
  });

  // Create wall mesh
  const wall = new Mesh(geometry, material);

  // Position wall mesh
  wall.position.set(...position);

  return wall;
}

export { createWall };
