// Import functions to build three.js meshes
import { createStone } from "./meshes/stone.js";
import { createDirt } from "./meshes/dirt.js";
import { createGrass } from "./meshes/grass.js";
import { createWater } from "./meshes/water.js";
import { createWaterfall } from "./meshes/waterfall.js";
import { createWall } from "./meshes/wall.js";
import { createFireFly } from "./meshes/fireflies.js";
import { createCloud } from "./meshes/clouds.js";
import { createMoon } from "./meshes/moon.js";
import { createWaterDrop } from "./meshes/waterDrops.js";

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
  generateBlocks(meshArray, createDirt, -11.5, 7);

  // Generate grass blocks and add to scene
  generateBlocks(meshArray, createGrass, -2.5, 3);

  // Generate the 2D Moon mesh in the sky
  meshArray.push(createMoon());

  return meshArray;
}

//Creates an array of meshes that need to be updated/have their update method called.
// Pushes each new mesh on to the end of said array.
//First creates the water mesh, then pushes 128 firefly meshes on to the end and returns the whole array.
// We also create a sky containing 20 cloud units
function buildUpdateables() {
  // Contains all meshes that need to have their update function called each frame
  const updateablesArray = [];

  // Create the ground level water mesh
  updateablesArray.push(createWater());

  // Create the sky made up of the given number of cloud units
  const numberOfClouds = 20;
  let newCloud;
  for (let i = 0; i < numberOfClouds; i++) {
    newCloud = createCloud();
    updateablesArray.push(newCloud);
  }
  // updateablesArray.push(createSky(numberOfClouds));

  // Create the total number of firefly meshes and push them to the updateables array
  const totalFireFlies = 128;
  let newFireFly;
  for (let i = 0; i < totalFireFlies; i++) {
    newFireFly = createFireFly(i);
    updateablesArray.push(newFireFly);
  }

  // Create the total number of waterdrop meshes belonging to the waterfall and push them to the updateables array
  const totalWaterDrops = 30;
  let newWaterDrop;
  for (let i = 0; i < totalWaterDrops; i++) {
    newWaterDrop = createWaterDrop();
    updateablesArray.push(newWaterDrop);
  }

  // Return the array of meshes that need to be updated every frame
  return updateablesArray;
}

// Generates a specified block in a specified area
function generateBlocks(meshArray, createMesh, startingY, limit) {
  let y = startingY;

  // Create and constrain mesh to a designated x, y, z area
  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      if (getRandomInt(0, 10) < limit) {
        const mesh = createMesh(x, y, z);
        meshArray.push(mesh);
      }
    }
  }
}

// Generate stones behind waterfall
function createWaterFallStone(meshArray) {
  // Create and constrain stones to a designated x, y, z area
  for (let y = 3.7; y <= 43.7; y += 10) {
    for (let x = 15; x >= -15; x -= 10) {
      const stone = createStone(x, y, getRandomInt(50, 52));
      meshArray.push(stone);
    }
  }
}

// Generate dirt wall on the left side of the world
function createLeftDirtWall(
  meshArray,
  xRangeStart,
  xRangeEnd,
  yRangeStart,
  yRangeEnd
) {
  let depth = 52.25;

  // Create and constrain dirt to a designated x, y, z area
  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let x = xRangeStart; x >= xRangeEnd; x -= 10) {
      if (generateChance(0.5)) {
        const dirt = createDirt(x, y, depth);
        meshArray.push(dirt);
      }
    }
  }
}

// Generate dirt wall on the right side of the world
function createRightDirtWall(
  meshArray,
  zRangeStart,
  zRangeEnd,
  yRangeStart,
  yRangeEnd
) {
  let depth = -52.25;
  let startingY = -2.5;

  // Ceate and constrain dirt to a designated x, y, z area
  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let z = zRangeStart; z >= zRangeEnd; z -= 10) {
      if (generateChance(0.5)) {
        const dirt = createDirt(depth, y, z);
        meshArray.push(dirt);
      }
    }
  }

  // Create and constrain grass to a designated x, y, z area
  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      if (getRandomInt(0, 10) < 6) {
        const grass = createGrass(x, startingY, z);
        meshArray.push(grass);
      }
    }
  }
}

// Generate dirt and grass at topmost layer
function createTopLayer(meshArray) {
  // Create and constrain grass to a designated x, y, z area
  for (let x = 45; x >= 25; x -= 10) {
    for (let z = 45; z >= 35; z -= 10) {
      const grass = createGrass(x, 45, z);
      meshArray.push(grass);
    }
  }

  // Create and constrain grass to a designated x, y, z area
  for (let x = -25; x >= -45; x -= 10) {
    for (let z = 45; z >= 5; z -= 10) {
      const grass = createGrass(x, 43, z);
      meshArray.push(grass);
    }
  }

  // Create and constrain grass to a designated x, y, z area
  for (let z = -25; z >= -45; z -= 10) {
    for (let x = -45; x <= -35; x += 10) {
      const grass = createGrass(x, 43, z);
      meshArray.push(grass);
    }
  }

  // Handmade stylistic touches for grass blocks
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

// Takes a chance as a float representing a percentage, i.e. 60% as 0.6, and returns true based on a randomly generated value if that value falls within 60% or less, false otherwise.
function generateChance(chance) {
  const probability = chance.toFixed(2);

  const thisChanceEvent = Math.random();

  if (thisChanceEvent < probability) {
    return true;
  } else {
    return false;
  }
}

//Given a float range from lowerBound (inclusive) to upperBound(non-inclusive), to a precisionPlace number of digits after the decimal, return a floating point value within that range.
function getRandomFloat(lowerBound, upperBound) {
  return Math.random() * (upperBound - lowerBound) + lowerBound;
}

export { buildWorld, buildUpdateables, getRandomFloat, getRandomInt };
