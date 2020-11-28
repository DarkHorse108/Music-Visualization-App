import {
  MeshBasicMaterial,
  Mesh,
  SphereBufferGeometry,
} from "../../three.module.js";
import { getRandomFloat, getRandomInt } from "../buildWorld.js";

function createFireFly(fireFlyNumber) {
  // Allowable x, y, and z range for each firefly
  const xRange = { min: -45, max: 48 };
  const yRange = { min: 4, max: 30 };
  const zRange = { min: -52, max: 45 };

  // default speed of the firefly as it travels in the positive x and z axes direction
  const fireFlySpeed = 0.02;

  // default color in hex of a firefly
  const defaultColor = 0xffff7a;
  // 0xcbf3f7
  //Size of each firefly and number of segments in its geometry, which influences its shape. We choose irregular spherical shapes so that each firefly looks distinct.
  const fireFlyRadius = 0.2;
  const fireFlySegments = getRandomInt(1, 5);

  // Material, geometry, and mesh
  const material = new MeshBasicMaterial({
    color: defaultColor,
    transparent: true,
    opacity: 0.7,
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

  //Firefly number coresponds to the index value in the freqArray. FireFly with Id 0 represents freqArray[0].
  mesh.fireFlyId = fireFlyNumber;
  //Multiplier value on the amount of positive y axis movement a fireFly could potentially produce. Initialized to zero and adjusted in the update function.
  mesh.maxGain = 0;
  // Highest value that can be obtained for a frequency value from the audio analyser node for a given index.
  const frequencyMaxValue = 255;

  mesh.update = (freqArray) => {
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
      // Assign it a random coordinate for its x, y, and z axes that is guaranteed to be within the allowable range for those axes
      nextZ = getRandomFloat(zRange.min, zRange.max);
      nextX = getRandomFloat(xRange.min, xRange.max);
      mesh.position.y = getRandomFloat(yRange.min, yRange.max);
    }

    //At this point, the calculated next step was either allowable, or forced to be allowable by the above if statement, so we can safely move the firefly to its next location here
    mesh.position.z = nextZ;
    mesh.position.x = nextX;

    // If this firefly's Id and thus corresponding value for an index within the freqArray exists based on the freqArray's length
    if (mesh.fireFlyId < freqArray.length) {
      // Intensity is the ratio of the frequency value produced for the index corresponding to this firefly, divided by the highest possible value a frequency can have.
      let intensity = freqArray[mesh.fireFlyId] / frequencyMaxValue;

      // If this particular firefly has some frequency value returned from the song that is non zero, we change its color and scale
      if (intensity > 0) {
        // Increase its scale to make it more noticeable
        mesh.scale.set(2, 2, 2);

        // If this firefly is one of the fireflies representing an index within the firs 0-30 (inclusive) indices of the frequency array
        if (mesh.fireFlyId <= 30) {
          // Give it a primarily yellow color whose intensity is dependent on how large the frequency value it represents in the freqArray
          mesh.material.color.setRGB(intensity + 0.5, 0.79, 0);
          // Give its y axis maxGain to be 10. The first 0-30 indices are generally high frequency notes and are the most common. We want these to be very noticeable so they are yellow in color,
          mesh.maxGain = 10;

          // If this firefly is one of the fireflies representing an index within the second grouping of 31-60 (inclusive) indices of the frequency array
        } else if (31 <= mesh.fireFlyId && mesh.fireFlyId <= 60) {
          // Give it a primarily purple color whose intensity is dependent on how large the frequency value it represents in the freqArray
          mesh.material.color.setRGB(intensity, 0.41, 0.59);
          // Give its y axis maxGain to be 15. The 31-60 indices are generally mid frequency notes and are the second most common. We want these to be noticeable but also be distinct from the high frequencies, so not only are they purple in color,
          // They have a lower potential for a y-axis jump/increase so they can be easily seen near the low-range frequencies in the song that they often accompany. Generally we should see the high frequency/red fireflies easily based on color, followed by the mid frequencies in blue above it.
          mesh.maxGain = 15;
          mesh.scale.set(
            intensity * 2 + 2,
            intensity * 2 + 2,
            intensity * 2 + 2
          );

          // If this firefly is one of the fireflies representing an index within the third grouping of 61-99 (inclusive) indices of the frequency array
        } else if (61 <= mesh.fireFlyId && mesh.fireFlyId <= 99) {
          // Give it a primarily darker blue color whose intensity is dependent on how large the frequency value it represents in the freqArray
          mesh.material.color.setRGB(0.33, 0.58, intensity + 0.4);
          // Give its y axis maxGain to be 25. The 61-99 indices are generally mid-low frequency notes and accompany the mid level frequencies in percussions in songs, and are utilized extensively in popular music.
          // We want these to be noticeable but also be distinct from the other frequencies, so they are more blue.
          // They have a very high potential for a y-axis jump/increase so they can be easily seen distinctly above the other frequencies.
          mesh.maxGain = 25;
        }

        // Set the opacity to correspond to the frequency intensity, with all fireflies with data having a minimum of 0.6 opacity so they are visible, but become much more so the higher the frequency intensity they receive.
        mesh.material.opacity = intensity + 0.6;

        // Since the if statements above divide the fireflies by color and y Axis jump potential, they actual Y axis jump value is calculated here depending on which category the firefly belongs to, high, mid, or low frequencies.
        mesh.position.y = randomY + intensity * mesh.maxGain;
      }
      // If the intensity of this firefly is 0 for this frame, set its color back to the default color and set its scale back to its original sizing.
      else {
        mesh.scale.set(1, 1, 1);
        mesh.material.color.setHex(defaultColor);
      }
    }
  };

  // Return the firefly mesh with all of the necessary properties and update method.
  return mesh;
}

export { createFireFly };
