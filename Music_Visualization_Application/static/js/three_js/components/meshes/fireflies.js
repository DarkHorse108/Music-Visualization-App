import {
  MeshBasicMaterial,
  Mesh,
  SphereBufferGeometry,
} from "../../three.module.js";
import { getRandomFloat } from "../buildWorld.js";
export { createFireFly };

function createFireFly(fireFlyNumber) {
  // Allowable x, y, and z range for each firefly
  const xRange = { min: -45, max: 48 };
  const yRange = { min: 8, max: 25 };
  const zRange = { min: -52, max: 45 };

  // default speed of the firefly as it travels in the positive x and z axes direction
  const fireFlySpeed = 0.03;

  // default color in hex of a firefly
  const defaultColor = 0xf0e68c;

  //Size of each firefly and number of segments in its geometry, which influences its shape
  const fireFlyRadius = 0.25;
  const fireFlySegments = 5;

  // Material, geometry, and mesh
  const material = new MeshBasicMaterial({
    color: defaultColor,
  });
  const geometry = new SphereBufferGeometry(
    fireFlyRadius,
    fireFlySegments,
    fireFlySegments
  );
  const mesh = new Mesh(geometry, material);

  // Choose random x, y, and z starting coordinates for this firefly
  const randomX = getRandomFloat(xRange.min, xRange.max);
  const randomY = getRandomFloat(yRange.min, yRange.max);
  const randomZ = getRandomFloat(zRange.min, zRange.max);
  mesh.position.set(randomX, randomY, randomZ);

  // Assign updated property/flag, which allows us to update the firefly's color and coordinates every other frame, for frames in between: the firefly is returned to its default color.
  mesh.updateFlag = false;
  //Firefly number coresponds to the index value in the freqArray. FireFly with Id 0 represents freqArray[0].
  mesh.fireFlyId = fireFlyNumber;
  //Multiplier value on the amount of positive y axis movement a fireFly could potentially produce. Initialized to zero and adjusted in the update function.
  mesh.maxGain = 0;
  // Highest value that can be obtained for a frequency value from the audio analyser node for a given index.
  const frequencyMaxValue = 255;

  mesh.update = (freqArray) => {
    // Intensity is the ratio of the frequency value produced for the index corresponding to this firefly, divided by the highest possible value a frequency can have.
    let intensity = freqArray[mesh.fireFlyId] / frequencyMaxValue;

    // If this particular firefly has some frequency value returned from the song that is non zero
    if (intensity > 0) {
      // Set its update flag to true, as we will update it in one of the if statements below
      mesh.updateFlag = true;

      // If this firefly is one of the fireflies representing an index within the firs 0-30 (inclusive) indices of the frequency array
      if (mesh.fireFlyId <= 30) {
        // Give it a primarily red color whose intensity is dependent on how large the frequency value it represents in the freqArray
        mesh.material.color.setRGB(
          intensity * 2 + 0.1,
          intensity * 1,
          intensity * 1
        );
        // Give its y axis maxGain to be 20. The first 0-30 indices are generally high frequency notes and are the most common. We want these to be very noticeable so not only are they red in color,
        // They have the highest potential for a y-axis jump/increase so they can be easily seen above mid to low frequencies in the song.
        mesh.maxGain = 20;

        // If this firefly is one of the fireflies representing an index within the second grouping of 31-60 (inclusive) indices of the frequency array
      } else if (31 <= mesh.fireFlyId && mesh.fireFlyId <= 60) {
        // Give it a primarily blue color whose intensity is dependent on how large the frequency value it represents in the freqArray
        mesh.material.color.setRGB(
          intensity * 1,
          intensity * 1,
          intensity * 2 + 0.1
        );
        // Give its y axis maxGain to be 15. The 31-60 indices are generally mid frequency notes and are the second most common. We want these to be noticeable but also be distinct from the high frequencies, so not only are they blue  in color,
        // They have a lower potential for a y-axis jump/increase so they can be easily seen above low frequencies in the song. Generally we should see the high frequency/red fireflies at the top, followed by the mid frequencies in blue below it.
        mesh.maxGain = 15;

        // If this firefly is one of the fireflies representing an index within the third grouping of 61-99 (inclusive) indices of the frequency array
      } else if (61 <= mesh.fireFlyId && mesh.fireFlyId <= 99) {
        // Give it a primarily green/blue color whose intensity is dependent on how large the frequency value it represents in the freqArray
        mesh.material.color.setRGB(0.07, intensity + 0.2, 0.96);
        // Give its y axis maxGain to be 10. The 61-99 indices are generally low frequency notes and are not as commonly given values in songs. We want these to be noticeable but also be distinct from the other frequencies, so they are more blue-greenish.
        // They have a lower potential for a y-axis jump/increase so they can be easily seen distinctly below the other frequencies.
        mesh.maxGain = 10;
      }

      // Since the if statements above divide the fireflies by color and y Axis jump potential, they actual Y axis jump value is calculated here depending on which category the firefly belongs to, high, mid, or low frequencies.
      mesh.position.y = randomY + intensity * mesh.maxGain;
    }
    // If the intensity of this firefly is 0 for this frame, set its color back to the default color and set its update flag to false, so it can be checked whether or not it needs to be updated in the next frame if it happens to finally receive som frequency data
    else {
      mesh.material.color.setHex(defaultColor);
      mesh.updateFlag = false;
    }

    // Record the current x and z position, as this will be used to increment the firefly's movement in the x and z axes
    let currentX = mesh.position.x;
    let currentZ = mesh.position.z;

    // Calculate the firefly's next step/movement location
    let nextX = currentX + fireFlySpeed;
    let nextZ = currentZ + fireFlySpeed;

    // If the firefly's next movement location value is outside of the allowable x and z axes range.
    if (
      nextZ < zRange.min ||
      nextZ > zRange.max ||
      nextX < xRange.min ||
      nextX > xRange.max
    ) {
      // Assign it a random coordinate for its x and z axes that is guaranteed to be within the allowable range for those axes
      nextZ = getRandomFloat(zRange.min, zRange.max);
      nextX = getRandomFloat(xRange.min, xRange.max);
    }

    //At this point, the calculated next step was either allowable, or forced to be allowable by the above if statement, so we can safely move the firefly to its next location here
    mesh.position.z = nextZ;
    mesh.position.x = nextX;
  };

  // Return the firefly mesh with all of the necessary properties and update method.
  return mesh;
}
