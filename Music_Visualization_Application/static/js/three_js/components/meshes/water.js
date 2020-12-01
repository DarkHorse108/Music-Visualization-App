import {
  BoxGeometry,
  MeshToonMaterial,
  DoubleSide,
  Mesh,
} from "../../three.module.js";

const dimensions = [102, 102, 28]; // dimensions represented as [x, y, z]

function createWater() {
  // Create geometry of water mesh
  const geometry = new BoxGeometry(...dimensions);

  // Adjust each vertex of the water Geometry to a random place in the x,y,z plane within reasonable distance from where it is generated.
  for (let i = 0; i < geometry.vertices.length; i++) {
    let vertex = geometry.vertices[i];
    if (vertex.z > 0) {
      vertex.z += Math.random() * 2 - 1;
    }

    vertex.x += Math.random();
    vertex.y += Math.random();

    vertex.wave = Math.random() * 100;
  }

  // Smoothes the flat faces as well as the vertices of the waterGeometry shape after the random values for the vertex coordinates have been generated
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

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

  water.update = (freqArray) => {};

  return water;
}

export { createWater };
