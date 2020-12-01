import {
  BoxBufferGeometry,
  MeshToonMaterial,
  DoubleSide,
  Mesh,
} from "../../three.module.js";

const dimensions = [102, 102, 28]; // dimensions represented as [x, y, z]

function createWater() {
  // Create geometry of water mesh
  const geometry = new BoxBufferGeometry(...dimensions);

  // Create water material
  const material = new MeshToonMaterial({
    color: 0x6092c1,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide,
  });

  // Create water mesh
  const water = new Mesh(geometry, material);

  // Enable receiving of shadow
  water.receiveShadow = true;

  // Adjust the x axis rotation and y axis position to face upwards.
  water.rotation.x = -Math.PI / 2;
  water.position.y = -105;

  // Reposition water mesh
  water.position.set(0, -15, 0);

  // Add .waterBlock boolean property to allow easier identification during iteration
  water.waterBlock = true;

  // Increase and decrease the position of the water mesh in the y axis in a set interval using the predictable pattern of Sin
  // inspiration for this was taken from a question regarding pivoting meshes side to side found here:
  // https://stackoverflow.com/questions/40966828/three-js-rotate-an-object-back-and-forth-between-two-azimuth-angles
  water.update = (freqArray) => {
    water.position.y -= Math.sin(Date.now() * 0.005) * Math.PI * 0.007;
  };

  return water;
}

export { createWater };
