import {
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
} from "../../three.module.js";
import { getRandomFloat } from "../buildWorld.js";

// Returns a mesh of particles, with the given quantity, size, and color of the particles. The particles
// are initialized randomly within the given xRange, yRange, and zRange objects of {min: value, max: value}
// reflecting the ranges of each of the respective axes, with the minimum value being inclusive, and the maximum value being non-inclusive.
function createParticles(quantity, size, color, xRange, yRange, zRange) {
  // The number of particles requested
  const particleQuantity = quantity;
  // The size of the particles requested
  const particleSize = size;
  // The color of the particles requested
  const particleColor = color;

  // Create the new geometry that will define these particles, and how many will be drawn based on the particelQuantity member
  let particleGeometry = new BufferGeometry();
  particleGeometry.setDrawRange(0, particleQuantity);

  //Initialize the positions of each of the particles
  let particlePositions = new Float32Array(particleQuantity * 3);
  initializePositions(
    particlePositions,
    particleQuantity,
    xRange,
    yRange,
    zRange
  );

  particleGeometry.setAttribute(
    "position",
    new BufferAttribute(particlePositions, 3)
  );

  // Create the new material that will define these particles
  let particleMaterial = new PointsMaterial({
    color: particleColor,
    size: particleSize,
  });

  //Create the mesh that will combine the geometry and materials of the Points data
  let particleMesh = new Points(particleGeometry, particleMaterial);

  // Save basic underlying data regarding the particles in the mesh object
  particleMesh.xRange = xRange;
  particleMesh.yRange = yRange;
  particleMesh.zRange = zRange;
  particleMesh.particleQuantity = particleQuantity;
  particleMesh.particleSize = particleSize;
  particleMesh.particleColor = particleColor;

  // Creates a list of objects that can hold information on what needs to be updated for each particle within the mesh. Each particle will be represented by an index, and each index contains an object whose properties can be added to in order to keep track
  // of information about that particular particle that may need to be updated later. This is for flexibility.
  particleMesh.updateArray = [];
  for (let j = 0; j < particleQuantity; j++) {
    particleMesh.updateArray.push({ yOrigin: 0, updated: false });
  }

  // Return the completed Mesh
  return particleMesh;
}

function initializePositions(
  particlePositions,
  particleQuantity,
  xRange,
  yRange,
  zRange
) {
  // For each particle
  for (let particle = 0; particle < particleQuantity; particle++) {
    // Generate a random float representing an x coordinate, y coordinate, and z coordinate between the given coordinates
    // for each respective axis.
    let randomX = getRandomFloat(xRange.min, xRange.max);
    let randomY = getRandomFloat(yRange.min, yRange.max);
    let randomZ = getRandomFloat(zRange.min, zRange.max);

    // If this is the first particle, aka the 0th particle, then the indices that represent its x,y,z coordinates range from 0 to 2 (inclusive).
    // currentMaximum represents the the upper bound of the index for this particular particle.
    // If this is the second particle, aka the 1th particle, then the indices go from index i = 1 * 3 = 3 to [(1 * 3) + 3 = 6] index 6.
    let currentMaximum = particle * 3 + 3;

    // axisDeterminer starts at 0, means the first index in this grouping of 3, representing the x coordinate.
    // axisDeterminer is incremented up to 2, where 1 represents the y coordinate and 2 represents the z coordinate
    // axisDeterminer is then reset to 0 for a new triplet of indices representing the next particle if applicable
    let axisDeterminer = 0;
    const xAxis = 0;
    const yAxis = 1;
    const zAxis = 2;

    // Assign the randomly generated x, y, z coordinate values for this particle
    for (let i = particle * 3; i < currentMaximum; i++) {
      if (axisDeterminer === xAxis) {
        particlePositions[i] = randomX;
      } else if (axisDeterminer === yAxis) {
        particlePositions[i] = randomY;
      } else if (axisDeterminer === zAxis) {
        particlePositions[i] = randomZ;
      }
      axisDeterminer++;
    }
  }
}

export { createParticles };
