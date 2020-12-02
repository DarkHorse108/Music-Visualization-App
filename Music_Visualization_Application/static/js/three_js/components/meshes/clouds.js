import {
  Group,
  Mesh,
  OctahedronBufferGeometry,
  MeshBasicMaterial,
  DoubleSide,
} from "../../three.module.js";
import { getRandomInt, getRandomFloat } from "../buildWorld.js";

// Creating clouds as groupings of Octahedron meshes,
// Inspired by the cloud generating algorithm found on a three.js tutorial by Karim Maaloul
// at https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
function createCloud() {
  const xRange = { min: -45, max: 18 };
  const yRange = { min: 70, max: 72 };
  const zRange = { min: -35, max: 35 };

  // Create the grouping that will hold the meshes that make up a single cloud
  let cloud = new Group();

  // Octahedron will be used and grouped together to make the appearance of soft, full clouds
  let cloudGeometry = new OctahedronBufferGeometry(7, 1);

  // Let's create a off-white, transparent material
  let cloudMaterial = new MeshBasicMaterial({
    color: 0x989898,
    transparent: true,
    opacity: 0.08,
    side: DoubleSide,
  });

  // duplicate the geometry a random number of times
  // The number of octahedrons per cloud unit will be minimum 5 plus some random amount no more than 3.
  let cloudBlocks = 3 + Math.floor(Math.random() * 2);
  for (var i = 0; i < cloudBlocks; i++) {
    // Create the mesh component of this particular cloud unit
    let cloudMesh = new Mesh(cloudGeometry, cloudMaterial);

    // Create a random position for the cloud piece in 3d space within this unit
    cloudMesh.position.x = Math.random() * 30;
    cloudMesh.position.y = Math.random() * 3;
    cloudMesh.position.z = Math.random() * 20;

    // Rotate the octahedron around its z and y axes to give it some variation
    cloudMesh.rotation.z = Math.random() * Math.PI * 2;
    cloudMesh.rotation.y = Math.random() * Math.PI * 2;

    // Randomly generate a scale for each piece of this overall cloud unit
    let randomScale = 0.1 + Math.random() * 0.9;
    cloudMesh.scale.set(randomScale, randomScale, randomScale);

    // Add this cloud piece to the overall cloud unit
    cloud.add(cloudMesh);
  }

  // Set the position of the Cloud group to a given coordinate within allowable/desirable 3D space
  cloud.position.set(
    getRandomInt(xRange.min, xRange.min + 5),
    getRandomInt(yRange.min, yRange.max),
    getRandomInt(zRange.min, zRange.max)
  );

  // The update function is called for each frame
  cloud.update = () => {
    // Value by which the Opacity is reduced per frame
    const OPACITY_DECAY_RATE = 0.000006;

    // Opacity value of the cloud group mesh at instantiation, is used to reset the opacity of the cloud group mesh when it is repositioned in the scene
    const ORIGINAL_OPACITY = 0.08;

    // Decrement opacity by the given value per frame, such that the cloud group as a whole eventually becomes transparent
    decayOpacity(cloud, OPACITY_DECAY_RATE);

    // Have the cloud group also move towards the positive x axis direction at a rate that is randomly chosen
    cloud.position.x += getRandomFloat(0.009, 0.02);

    // If the cloud has reached the edge of the scne
    if (cloud.position.x >= xRange.max) {
      // Return the cloud to the x-axis coordinate representing the top right of the scene
      cloud.position.x = xRange.min;
      // Position the cloud unit to be at a random z coordinate towards the camera
      cloud.position.z = getRandomInt(zRange.min, zRange.max);

      // Reset the opacity of the cloud unit from fully transparent to its original opacity value
      resetOpacity(cloud, ORIGINAL_OPACITY);
    }
  };

  // Flag used to mark this mesh as an exception to the transparency/fade in effect of the animation scene as a whole during load in
  cloud.cloudBlock = true;

  // Return the overarching cloud unit
  return cloud;
}

// Takes a THREE Group object, and decreases the opacity of each of its child meshes by the given value in argument opacityDecay
function decayOpacity(groupMesh, opacityDecay) {
  groupMesh.children.forEach((child) => {
    if (child.material) {
      child.material.opacity -= opacityDecay;
    }
  });
}

// Takes a THREE Group object, and sets the opacity of each of its children to a given value in argument opacitySet
function resetOpacity(groupMesh, opacitySet) {
  groupMesh.children.forEach((child) => {
    if (child.material) {
      child.material.opacity = opacitySet;
    }
  });
}

export { createCloud };
