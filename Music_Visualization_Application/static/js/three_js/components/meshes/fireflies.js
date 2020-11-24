import { getRandomFloat } from "../buildWorld.js";

// Takes a particle Mesh and uses its underlying data to transform the particle behavior into that of fireflies.
// Takes the particleMesh and defines its update function to reflect firefly behavior.
function createFireFlies(particleMesh) {
  // Define the update function for this particle mesh that will represent the behavior of fireflies
  particleMesh.update = (accumulator, freqArray) => {
    // It takes the position array of the underlying geometry for the mesh
    const positionArray = particleMesh.geometry.attributes.position.array;

    // This represents the maximum distance units in the Y direction that any one firefly will "jump" in response to the value it represents in the frequencyarray data for the music.
    const yAxisJump = 10;

    // We assign 3 objects with min and max properties that represent the allowable ranges
    // for incrementation along the respective axes, if we choose to pick a random value within that range later.
    particleMesh.xIncrement = { min: 0, max: 0 };
    particleMesh.yIncrement = { min: 0, max: 0 };
    particleMesh.zIncrement = { min: 0, max: 0 };

    // Constants that will represent which axis value we will be adjusting.
    const xAxis = 0;
    const yAxis = 1;
    const zAxis = 2;

    // For each point in the quantity of particles
    for (let point = 0; point < particleMesh.particleQuantity; point++) {
      //In terms of updating positions the position array is three times as large as the quantity of particles, as we must account for the x,y, and z coordinate for any one particle.
      // Thus for any given particle, the indices in the positionAray specific to that particular particle will range from index (point * 3) inclusive to index (point * 3 + 3) non inclusive, representing the x, y, and z axis concurrently.
      let currentMaximum = point * 3 + 3;

      // This value will let us keep track of which axis value for this particular particle that we are assigning
      let axisDeterminer = 0;

      // For each of the x, y, and z axes values for this particle
      for (let i = point * 3; i < currentMaximum; i++) {
        // If we are examining the x axis value
        if (axisDeterminer === xAxis) {
          // Take that particular index that holds the x axis coordinate for this particle, and assign it some new random x coordinate value that has been produced
          // by the function getNextPosition, which takes into account the current x coordinate value, and increments that value based on the increment range, within the allowable range
          // of values that have been set for all particles in the 3d space.
          positionArray[i] = getNextPosition(
            positionArray[i],
            particleMesh.xRange,
            particleMesh.xIncrement
          );
        }
        // If we are examining the y axis value
        else if (axisDeterminer === yAxis) {
          // Look in index of the updateArray of the Mesh representing this particular point/particle.
          // If this point has not been updated
          if (particleMesh.updateArray[point].updated === false) {
            // Save the particle's current y axis position, this will serve as the baseline coordinate on the y axis for this particle
            let yCurrent = positionArray[i];
            // Save the particle's baseline coordinate to the yOrigin property in the object that resides in the updateArray representing this point/particle
            particleMesh.updateArray[point].yOrigin = yCurrent;

            // Find the index that corresponds to this point in the frequency array. Since values in the frequency array go from 0 to 255, we take the value in the frequency array and effectively convert it to a percentage,
            // i.e. for this frequency value if it contained 255, we would have 255/255 possible, resulting in 1. Or we might have some other lesser value such as 10/225. We take this proportion and multiply it by the
            // yAxisJump value representing the maximum y axis increase allowed for any particle. As such the maximum increase in the y direction is determined by yAxisJump, but the intensity of the frequency determines
            // the actual value we travel in the Y direction if we know that the highest number of units we can go is capped by the value in yAxisJump.
            let yNext = yCurrent + yAxisJump * (freqArray[point] / 255);

            // Take this new y axis coordinate that has been informed by the frequency data, and assign it as the new value on the y axis for this particular firefly
            positionArray[i] = yNext;

            // State that this firefly has been updated in the updateArray
            particleMesh.updateArray[point].updated = true;
          }
          // If this firefly had already been updated in the last frame
          else {
            // Set its update status back to false
            particleMesh.updateArray[point.updated] = false;

            // Reset the y axis position of this particle back to what it originally was, as we do not want to consecutively increase y axis values or else we will jump all the way out the top of the scene.
            positionArray[i] = particleMesh.updateArray[point].yOrigin;
          }
        }
        // If we are examining the z axis value
        else if (axisDeterminer === zAxis) {
          // Take that particular index that holds the z axis coordinate for this particle, and assign it some new random z coordinate value that has been produced
          // by the function getNextPosition, which takes into account the current z coordinate value, and increments that value based on the increment range, within the allowable range
          // of values that have been set for all particles in the 3d space.
          positionArray[i] = getNextPosition(
            positionArray[i],
            particleMesh.zRange,
            particleMesh.zIncrement
          );
        }

        // Update the axis Determiner to make sure we examine the x, y, and z values for this firefly
        axisDeterminer++;
      }
    }

    particleMesh.geometry.attributes.position.needsUpdate = true;
    particleMesh.geometry.setDrawRange(0, particleMesh.particleQuantity);
  };
}

// Returns a value representing a position on either the x,y,z, within the particle mesh's acceptable coordinate range for that particular axis
function getNextPosition(currentPosition, axisRange, incrementRange) {
  {
    // randomIncrement will hold the value we may potentially increment the current coordinate by
    let randomIncrement;

    // nextPosition will hold the value of the next position the particle could take
    let nextPosition;

    // Get a random increment value within the allowable increment range
    randomIncrement = getRandomFloat(incrementRange.min, incrementRange.max);

    // Determine the next position by taking the particle's current position and adding to it the randomly chosen increment value within the acceptable range
    nextPosition = currentPosition + randomIncrement;

    // If the next position value we produced is above the acceptable range for particles on this axis, or below the acceptable range
    if (nextPosition > axisRange.max || nextPosition < axisRange.min) {
      // We choose a random value within the acceptable range for this particular axis and assign it to nextPosition, that way no matter what value is assigned to nextPosition,
      // it will always be a valid value.
      nextPosition = getRandomFloat(axisRange.min, axisRange.max);
    }

    // Return the new valid position on this axis for the particle.
    return nextPosition;
  }
}

export { createFireFlies };
