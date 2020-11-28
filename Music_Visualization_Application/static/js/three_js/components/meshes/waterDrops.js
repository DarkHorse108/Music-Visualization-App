import {
  Mesh,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  DoubleSide,
} from "../../three.module.js";
import { getRandomInt, getRandomFloat } from "../buildWorld.js";

// Creates a single water Droplet
function createWaterDrop() {
  // Limits indicate the range allowed for this droplet in 3d space
  const zLimit = 38;
  const yRange = { min: 38, max: 48 };
  const xRange = { min: -18, max: 18 };

  // Create a flat, memory efficient rectangular geometry that is nearly transparent
  const dropGeometry = new PlaneBufferGeometry(15, 8, 8);
  const dropMaterial = new MeshBasicMaterial({
    color: 0x6092c1,
    side: DoubleSide,
    transparent: true,
    opacity: 0.015,
  });

  // Create the mesh for this water "droplet"
  let waterDrop = new Mesh(dropGeometry, dropMaterial);

  // Add the mesh in 3d space within its allowable range in the x and y axis, its place in the z axis will remain constant
  waterDrop.position.set(
    getRandomInt(xRange.min, xRange.max),
    getRandomInt(yRange.min, yRange.max),
    zLimit
  );
  // Give this mesh an update function such that it will decrease its position on the y axis until it reaches y coordinate 9, at which time it will then be re positioned in the scene at the top of the waterfall
  waterDrop.update = () => {
    if (waterDrop.position.y <= 9) {
      waterDrop.position.y = getRandomInt(yRange.min, yRange.max);
      waterDrop.position.x = getRandomInt(xRange.min, xRange.max);
    } else {
      // Below is how the drop rate of each waterfall is chosen randomly within the given range.
      waterDrop.position.y -= getRandomFloat(0.1, 0.5);
    }
  };

  // return the water drop
  return waterDrop;
}

export { createWaterDrop };
