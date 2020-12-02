import {
  Group,
  BoxBufferGeometry,
  MeshToonMaterial,
  MeshStandardMaterial,
  FrontSide,
  Mesh,
} from "../../three.module.js";

import { getRandomInt, getRandomFloat } from "../buildWorld.js";

const dirtColors = [0xe6a376, 0xeab28b];
const grassColors = [0x1e8449, 0x229954, 0x229954];
const treeTrunkColors = [0xa7a87e, 0xc7a87e, 0xe7a87e];
const treeLeafColors = [0x00cc66, 0x33cc66, 0x66cc66];

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

  // Add a tree to grass if random int is 0
  if (getRandomInt(0, 6) === 0) {
    // Create tree trunk
    const treeTrunkPos = [0, 5, 0];
    const treeTrunkGeometry = new BoxBufferGeometry(1, getRandomInt(14, 17), 1);
    const treeTrunkMaterial = new MeshStandardMaterial({
      color:
        treeTrunkColors[Math.floor(Math.random() * treeTrunkColors.length)],
      roughness: 1,
    });
    const treeTrunkMesh = new Mesh(treeTrunkGeometry, treeTrunkMaterial);

    // Position tree trunk then add to grassBlock group
    treeTrunkMesh.position.set(...treeTrunkPos);
    grassBlock.add(treeTrunkMesh);

    // Set tree leaf levels
    const treeLeafLevels = getRandomInt(3, 6);

    // Set random rotation of tree leaves as a whole
    const wholeRotation = getRandomFloat(0, 2 * Math.PI);

    // Create tree leaf mesh per level
    for (let i = 0; i < treeLeafLevels; i++) {
      // Set tree leaf position
      const treeLeafPos = [0, treeTrunkGeometry.parameters.height - 3 + i, 0];

      // Create tree leaf geometry
      const treeLeafGeometry = new BoxBufferGeometry(
        treeLeafLevels - i,
        1,
        treeLeafLevels - i
      );

      // Create tree leaf material
      const treeLeafMaterial = new MeshStandardMaterial({
        color:
          treeLeafColors[Math.floor(Math.random() * treeLeafColors.length)],
        roughness: 1,
      });

      // Create tree leaf mesh
      const treeLeafMesh = new Mesh(treeLeafGeometry, treeLeafMaterial);

      // Rotate and position tree leaf then add to grassBlock group
      treeLeafMesh.position.set(...treeLeafPos);
      treeLeafMesh.rotation.y +=
        (i * Math.PI) / (treeLeafLevels * 2) + wholeRotation;
      grassBlock.add(treeLeafMesh);
    }
  }

  // Position grouped block mesh
  grassBlock.position.set(x, y, z);

  return grassBlock;
}

export { createGrass };
