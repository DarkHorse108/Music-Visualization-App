import { createStone } from "./meshes/stone.js";
import { createDirt } from "./meshes/dirt.js";
import { createGrass } from "./meshes/grass.js";
import { createWater } from "./meshes/water.js";
import { createWaterfall } from "./meshes/waterfall.js";
import { createWall } from "./meshes/wall.js";

function buildWorld() {
  // Array to store created meshes
  const meshArray = [];

  // Create top layer
  createTopLayer(meshArray);

  // Create left wall ( [dimensions], [x, y, z] ) and add to scene
  meshArray.push(createWall([100, 70, 5], [0, 13.5, 50]));

  // Create right wall ( [dimensions], [x, y, z] ) and add to scene
  meshArray.push(createWall([5, 70, 100], [-50, 13.5, 0]));

  // Create left dirt walls and add to scene
  createLeftDirtWall(meshArray, 44, 24, 15.5, 35.5);
  createLeftDirtWall(meshArray, -25, -45, 15.5, 35.5);

  // Create right dirt walls and add to scene
  createRightDirtWall(meshArray, 43, -37, 15.5, 35.5);

  // Create waterfall and add to scene
  meshArray.push(createWaterfall(0, 22, 45));

  // Create stones behind waterfall and add to scene
  createWaterFallStone(meshArray);

  // Generate stone blocks and add to scene
  generateBlocks(meshArray, createStone, -20.5, 9);

  // Generate dirt blocks and add to scene
  generateBlocks(meshArray, createDirt, -11.5, 6);

  // Generate grass blocks and add to scene
  generateBlocks(meshArray, createGrass, -2.5, 6);

  return meshArray;
}

function buildWater() {
  const updateablesArray = [];

  // Create water on floor level
  updateablesArray.push(createWater());

  return updateablesArray;
}

function generateBlocks(meshArray, createMesh, startingY, limit) {
  let y = startingY;
  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      if (getRandomInt(0, 10) < limit) {
        const mesh = createMesh(x, y, z);
        meshArray.push(mesh);
      }
    }
  }
}

function createWaterFallStone(meshArray) {
  // Generate stones behind waterfall
  for (let y = 3.7; y <= 43.7; y += 10) {
    for (let x = 15; x >= -15; x -= 10) {
      const stone = createStone(x, y, getRandomInt(50, 52));
      meshArray.push(stone);
    }
  }
}

function createLeftDirtWall(
  meshArray,
  xRangeStart,
  xRangeEnd,
  yRangeStart,
  yRangeEnd
) {
  let depth = 52.25;

  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let x = xRangeStart; x >= xRangeEnd; x -= 10) {
      if (generateChance(0.5)) {
        const dirt = createDirt(x, y, depth);
        meshArray.push(dirt);
      }
    }
  }
}

function createRightDirtWall(
  meshArray,
  zRangeStart,
  zRangeEnd,
  yRangeStart,
  yRangeEnd
) {
  let depth = -52.25;
  let startingY = -2.5;

  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let z = zRangeStart; z >= zRangeEnd; z -= 10) {
      if (generateChance(0.5)) {
        const dirt = createDirt(depth, y, z);
        meshArray.push(dirt);
      }
    }
  }

  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      if (getRandomInt(0, 10) < 6) {
        const grass = createGrass(x, startingY, z);
        meshArray.push(grass);
      }
    }
  }
}

function createTopLayer(meshArray) {
  //Iterative generation
  for (let x = 45; x >= 25; x -= 10) {
    for (let z = 45; z >= 35; z -= 10) {
      const grass = createGrass(x, 45, z);
      meshArray.push(grass);
    }
  }

  for (let x = -25; x >= -45; x -= 10) {
    for (let z = 45; z >= 5; z -= 10) {
      const grass = createGrass(x, 43, z);
      meshArray.push(grass);
    }
  }

  for (let z = -25; z >= -45; z -= 10) {
    for (let x = -45; x <= -35; x += 10) {
      const grass = createGrass(x, 43, z);
      meshArray.push(grass);
    }
  }

  // Handmade stylistic touches
  meshArray.push(createGrass(-45, 43, -5));
  meshArray.push(createGrass(-35, 43, -5));
  meshArray.push(createGrass(-45, 43, -15));
  meshArray.push(createGrass(45, 45, 25));
  meshArray.push(createGrass(35, 45, 25));
  meshArray.push(createGrass(45, 45, 15));
}

// Choose a random integer between min (inclusive) and max (non-inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Takes a success, and chance, as integers, i.e. 1 in 3, and generates true in 1 in 3 calls to the function on average, false otherwise.
function generateChance(chance) {
  const probability = chance.toFixed(2);

  const thisChanceEvent = Math.random();

  if (thisChanceEvent < probability) {
    return true;
  } else {
    return false;
  }
}

export { buildWorld, buildWater };
