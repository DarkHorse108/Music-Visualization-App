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

  // Set the cloud made up of cloud units into a random x, y, z coordinate in 3d space based on our desired limitations along the axes
  // cloud.position.set(
  //   getRandomInt(xRange.min, xRange.max),
  //   getRandomInt(yRange.min, yRange.max),
  //   getRandomInt(zRange.min, zRange.max)
  // );
  cloud.position.set(
    getRandomInt(xRange.min, xRange.min + 5),
    getRandomInt(yRange.min, yRange.max),
    getRandomInt(zRange.min, zRange.max)
  );

  cloud.update = () => {
    decayOpacity(cloud, 0.000006);
    cloud.position.x += getRandomFloat(0.009, 0.02);

    if (cloud.position.x >= xRange.max) {
      cloud.position.x = xRange.min;
      cloud.position.z = getRandomInt(zRange.min, zRange.max);
      resetOpacity(cloud);
    }
  };

  cloud.cloudBlock = true;

  // Return the overarching cloud unit
  return cloud;
}

function decayOpacity(groupMesh, opacityDecay) {
  groupMesh.children.forEach((child) => {
    if (child.material) {
      child.material.opacity -= opacityDecay;
    }
  });
}

function resetOpacity(groupMesh) {
  groupMesh.children.forEach((child) => {
    if (child.material) {
      child.material.opacity = 0.08;
    }
  });
}

export { createCloud };