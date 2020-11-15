// import * as THREE from "./three.js/build/three.module.js";

// import * as OrbitControls from "./three.js/examples/js/controls/OrbitControls.js";

var scene,
  camera,
  controls,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  backLight,
  light,
  renderer,
  container;

// global Constants
const waterMaterial = new THREE.MeshToonMaterial({
  color: 0x6092c1,
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
});

const wallMaterial = new THREE.MeshToonMaterial({
  color: 0xedbb99,
  side: THREE.FrontSide,
});

const globalDirtColors = [0xe6a376, 0xeab28b];

const globalStoneColors = [0x4d5656, 0x515a5a, 0x616a6b];

const globalGrassColors = [0x1e8449, 0x229954, 0x229954];

// Adjustable global vars
let waterMesh, HEIGHT, WIDTH;

// This array holds each instance of a water droplet.
let drops = [];

//INIT
function init() {
  // Create a new Scene
  scene = new THREE.Scene();

  // Create fog for the scene
  // scene.fog = new THREE.Fog(0xece9ca, 800, 2000);

  // Initialize Values for the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 100;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set Camera starting position
  camera.position.x = 90;
  camera.position.z = -95;
  camera.position.y = 80;

  // Set where the Camera is looking
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Create the new renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  // Set the renderer size
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

  // Append the canvas as a child of the document body
  container = document.body;
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);

  // Orbit control values
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.minPolarAngle = -Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 2 + 0.1;
  // controls.noZoom = false;
  // controls.noPan = true;
}

// Detect Window resize and adjust renderer size and aspect ratio if a resize occurs
function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  // Create a hemispherical lighting
  light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.65);

  // Create directional lighting above the objects of interest and specify shadow map values
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.7);
  shadowLight.position.set(80, 120, 50);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = 0.3;
  shadowLight.shadowMapWidth = 2048;
  shadowLight.shadowMapHeight = 2048;

  // Create another directional light behind the objects of interest
  // backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  // backLight.position.set(100, 100, 100);
  // backLight.shadowDarkness = 0.1;
  // backLight.castShadow = true;

  // Add the three lights that were created
  // scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}

// Adds axes guides for assisting placing objects
function setAxesHelper(node) {
  const axesSize = 100;
  const axes = new THREE.AxesHelper(axesSize);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  node.add(axes);
}

//Given a float range from lowerBound (inclusive) to upperBound(non-inclusive), to a precisionPlace number of digits after the decimal, return a floating point value within that range.
function getRandomFloat(lowerBound, upperBound, precisionPlaces) {
  return (Math.random() * (upperBound - lowerBound) + lowerBound).toFixed(
    precisionPlace
  );
}

// Choose a random integer between min (inclusive) and max (non-inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Given an array, choose a random valid index within it
function getRandomIndex(array) {
  let arrayLength = array.length;
  if (arrayLength >= 1) {
    let randomIndex = getRandomInt(0, arrayLength);
    return randomIndex;
  } else {
    return;
  }
}

// Takes a success, and chance, as integers, i.e. 1 in 3, and generates true in 1 in 3 calls to the function on average, false otherwise.
function generateChance(chance) {
  let probability = chance.toFixed(2);

  let thisChanceEvent = Math.random();

  if (thisChanceEvent < probability) {
    return true;
  } else {
    return false;
  }
}

// Create the Water at the floor of the scene
function createWater() {
  // Create a new box, traslucent and placed over the floor's coordinates
  var waterGeometry = new THREE.BoxGeometry(102, 102, 15);

  // Adjust each vertex of the water Geometry to a random place in the x,y,z plane within reasonable distance from where it is generated.
  for (var i = 0; i < waterGeometry.vertices.length; i++) {
    var vertex = waterGeometry.vertices[i];
    if (vertex.z > 0) vertex.z += Math.random() * 2 - 1;
    vertex.x += Math.random();
    vertex.y += Math.random();

    vertex.wave = Math.random() * 100;
  }

  // Smoothes the flat faces as well as the vertices of the waterGeometry shape after the random values for the vertex coordinates have been generated
  waterGeometry.computeFaceNormals();
  waterGeometry.computeVertexNormals();

  // Create the new mesh for the water
  waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);

  // Adjust the x axis rotation and y axis position to face upwards.
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -105;
  waterMesh.receiveShadow = true;

  // Initialize the position of the water
  waterMesh.position.set(0, -10, 0);

  // Add the water to the scene
  scene.add(waterMesh);

  // Axes Helper Function call
  setAxesHelper(waterMesh);
}

// With each frame, if the waterMesh has already been instantiated, move the vertices of the water forward and backwards across the z axis.
function updateWater() {
  if (waterMesh) {
    for (var i = 0; i < waterMesh.geometry.vertices.length; i++) {
      var vertex = waterMesh.geometry.vertices[i];
      if (vertex.z > 0)
        vertex.z += Math.sin(accumulator * 0.05 + vertex.wave) * 0.05;

      waterMesh.geometry.verticesNeedUpdate = true;
    }
  }
}

// function createFloor() {
//   let floor = new THREE.BoxGeometry(100, 100, 3);
//   let floorMaterial = new THREE.MeshToonMaterial({ color: 0x9a7b4f });
//   let floorMesh = new THREE.Mesh(floor, floorMaterial);
//   floorMesh.rotation.x = -Math.PI / 2;
//   floorMesh.position.y = -105;
//   scene.add(floorMesh);
//   floorMesh.position.set(0, 0, 0);
// }

// Create the left wall. We use a box, size it and use the global wallMaterial for it, then place it in terms of x,y,z coordinates in the scene
function createLeftWall() {
  let leftWall = new THREE.BoxBufferGeometry(100, 70, 5);
  let leftWallMesh = new THREE.Mesh(leftWall, wallMaterial);
  leftWallMesh.position.y = 13.5;
  leftWallMesh.position.z = 50;
  scene.add(leftWallMesh);
}

// Create the right wall. We use a box, size it and use the global wallMaterial for it, then place it in terms of x,y,z coordinates in the scene
function createRightWall() {
  let rightWall = new THREE.BoxBufferGeometry(5, 70, 100);
  let rightWallMesh = new THREE.Mesh(rightWall, wallMaterial);
  rightWallMesh.position.y = 13.5;
  rightWallMesh.position.x = -50;
  scene.add(rightWallMesh);
}

// Given an array of colors, choose a random color value in hexadecimal format and return it
function randomColor(colorArray) {
  let randomIndex = getRandomIndex(colorArray);

  return colorArray[randomIndex];
}

function createStoneBlock(x, y, z) {
  let stoneGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
  let stoneMaterial = new THREE.MeshToonMaterial({
    color: randomColor(globalStoneColors),
    side: THREE.FrontSide,
  });
  let stoneMesh = new THREE.Mesh(stoneGeometry, stoneMaterial);
  stoneMesh.position.set(x, y, z);
  scene.add(stoneMesh);
}

function createDirtBlock(x, y, z) {
  let dirtGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
  dirtGeometry.computeFaceNormals();
  let dirtMaterial = new THREE.MeshStandardMaterial({
    color: randomColor(globalDirtColors),
    side: THREE.FrontSide,
    roughness: 1,
    metalness: 0,
  });
  let dirtMesh = new THREE.Mesh(dirtGeometry, dirtMaterial);
  dirtMesh.position.set(x, y, z);
  scene.add(dirtMesh);
}

function createGrassBlock(x, y, z) {
  let baseGeometry = new THREE.BoxBufferGeometry(10, 8, 10);
  let baseMaterial = new THREE.MeshToonMaterial({
    color: randomColor(globalDirtColors),
    side: THREE.FrontSide,
  });
  let baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  baseMesh.position.set(0, 0, 0);

  let grassGeometry = new THREE.BoxBufferGeometry(10, 2, 10);
  let grassMaterial = new THREE.MeshStandardMaterial({
    color: randomColor(globalGrassColors),
    roughness: 1,
    metalness: 0,
  });

  let grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
  grassMesh.position.set(0, 5, 0);

  let grassBlock = new THREE.Object3D();
  grassBlock.add(baseMesh);
  grassBlock.add(grassMesh);

  grassBlock.position.x = x;
  grassBlock.position.y = y;
  grassBlock.position.z = z;

  scene.add(grassBlock);
}

function createWaterBlock(x, y, z) {
  let waterGeometry = new THREE.BoxBufferGeometry(40, 55, 10);
  let waterBlock = new THREE.Mesh(waterGeometry, waterMaterial);
  waterBlock.position.x = x;
  waterBlock.position.y = y;
  waterBlock.position.z = z;

  scene.add(waterBlock);
}

// Creates a single water "drop" or particle.
let Drop = function () {
  // A single drop is a small box geometry, place it adjacent to the wall with a randomly generated position along the x-axis between -20 and 20 units.
  this.geometry = new THREE.BoxBufferGeometry(3, 3, 3);
  this.drop = new THREE.Mesh(this.geometry, waterMaterial);
  this.drop.position.set(Math.floor(Math.random() * 40) - 20, 49, 41);

  // Add the drop to the scene
  scene.add(this.drop);

  // Helps us figure out the vertical drop distance the single drop will travel along the y axis
  this.speed = 0;
  // This droplet will be removed from the scene for a randomly specified time period in milliseconds
  this.lifespan = Math.random() * 50 + 50;
  // Increase the speed of the fall of the drop, i.e. the y position in the negative direction "downwards" increases by the number of distance units stored in speed. Speed continues to increase with each update of every individual drop.
  // Furthermore, the lifespan value decreases constantly with each update and means that eventually each drop will be removed. The x position value where the drop was initially added/intantiated at decreases towards zero with each update as well
  // so it simulates falling towards the origin of the x-axis at 0.
  this.update = function () {
    this.speed += 0.01;
    this.lifespan -= 1.09;
    this.drop.position.x += (0.5 - this.drop.position.x) / 70;
    this.drop.position.y -= this.speed;
  };
};

// Given the value of the arbitrary counter that increases with each frame, if that value is a multiple of 10.
// Create a new water drop and push it onto the global array containing each water drop
function createWaterFall(accumulator) {
  if (accumulator % 5 == 0) {
    for (var i = 0; i < 5; i++) {
      drops.push(new Drop());
    }
  }
}

// With each frame, update the lifespan of each individual water drop such that each eventually disappears
function updateWaterFall(drops) {
  for (var i = 0; i < drops.length; i++) {
    drops[i].update();
    if (drops[i].lifespan < 0) {
      scene.remove(scene.getObjectById(drops[i].drop.id));
      drops.splice(i, 1);
    }
  }
}

// Generate the topmost level of grass blocks
function createTopLayer() {
  //Iterative Generation
  for (let x = 45; x >= 25; x -= 10) {
    for (let z = 45; z >= 35; z -= 10) {
      createGrassBlock(x, 45, z);
    }
  }

  for (let x = -25; x >= -45; x -= 10) {
    for (let z = 45; z >= 5; z -= 10) {
      createGrassBlock(x, 43, z);
    }
  }

  for (let z = -25; z >= -45; z -= 10) {
    for (let x = -45; x <= -35; x += 10) {
      createGrassBlock(x, 43, z);
    }
  }

  // Handmade stylistic touches
  createGrassBlock(-45, 43, -5);
  createGrassBlock(-35, 43, -5);
  createGrassBlock(-45, 43, -15);
  createGrassBlock(45, 45, 25);
  createGrassBlock(35, 45, 25);
  createGrassBlock(45, 45, 15);
}

function createWaterFallStone() {
  // Stones behind waterfall

  for (let y = 3.7; y <= 43.7; y += 10) {
    for (let x = 15; x >= -15; x -= 10) {
      createStoneBlock(x, y, getRandomInt(50, 52));
    }
  }
}

function createLeftWallTexture(xRangeStart, xRangeEnd, yRangeStart, yRangeEnd) {
  // let zRangeMin = 52;
  // let zRangeMax = 54;
  let depth = 52.25;

  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let x = xRangeStart; x >= xRangeEnd; x -= 10) {
      if (generateChance(0.5)) {
        // let depth = getRandomInt(zRangeMin, zRangeMax);

        createDirtBlock(x, y, depth);
      }
    }
  }
}

function createRightWallTexture(
  zRangeStart,
  zRangeEnd,
  yRangeStart,
  yRangeEnd
) {
  // let xRangeMin = -51;
  // let xRangeMax = -53;
  let depth = -52.25;

  for (let y = yRangeStart; y <= yRangeEnd; y += 10) {
    for (let z = zRangeStart; z >= zRangeEnd; z -= 10) {
      if (generateChance(0.5)) {
        // let depth = getRandomInt(xRangeMin, xRangeMax);

        createDirtBlock(depth, y, z);
      }
    }
  }
}

function createTerrain() {
  let startingY = -20.5;

  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      // let height = getRandomInt(1, 3);

      // for (let layer = 0; layer < height; layer++) {
      //   if (layer === height - 1) {
      //     createGrassBlock(x, layer * 10 + startingY, z);
      //   } else {
      //     createDirtBlock(x, layer * 10 + startingY, z);
      //   }
      // }

      if (getRandomInt(0, 10) < 9) {
        createStoneBlock(x, startingY, z);
      }
    }
  }

  startingY = -11.5;

  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      // let height = getRandomInt(1, 3);

      // for (let layer = 0; layer < height; layer++) {
      //   if (layer === height - 1) {
      //     createGrassBlock(x, layer * 10 + startingY, z);
      //   } else {
      //     createDirtBlock(x, layer * 10 + startingY, z);
      //   }
      // }

      if (getRandomInt(0, 10) < 6) {
        createDirtBlock(x, startingY, z);
      }
    }
  }

  startingY = -2.5;

  for (let z = 35.5; z >= -45.5; z -= 10) {
    for (let x = 45; x >= -52.5; x -= 10) {
      // let height = getRandomInt(1, 3);

      // for (let layer = 0; layer < height; layer++) {
      //   if (layer === height - 1) {
      //     createGrassBlock(x, layer * 10 + startingY, z);
      //   } else {
      //     createDirtBlock(x, layer * 10 + startingY, z);
      //   }
      // }

      if (getRandomInt(0, 10) < 6) {
        createGrassBlock(x, startingY, z);
      }
    }
  }
}

// Create the water and add any starting objects to the scene
function build() {
  createWater();
  // createFloor();
  createLeftWall();
  createRightWall();
  createWaterBlock(0, 22, 45);
  createTopLayer();
  createWaterFallStone();

  createLeftWallTexture(44, 24, 15.5, 35.5);

  createLeftWallTexture(-25, -45, 15.5, 35.5);

  createRightWallTexture(43, -37, 15.5, 35.5);
  createTerrain();

  //top left
  // createStoneBlock(45, 3.5, 42.5);

  // top right
  // createStoneBlock(-42.5, 3.5, 42.5);

  //bottom right
  // createStoneBlock(-42.5, 3.5, -45.5);

  // bottom left
  // createStoneBlock(45, 3.5, -45.5);
}

// Render the Scene
function render() {
  if (controls) controls.update();

  renderer.render(scene, camera);
}

// Arbitrary counter value that will increase by one with each frame, its value will be used to
let accumulator = 0;

// Iterate through each vertex of the waterMesh/water, modify the z-axis values for each to alternate between getting larger and then smaller, to simulate movement and give the illusion of the box as a whole moving.
// Render the newly calculated water, call loop again on each frame to keep redrawing the water.
function loop() {
  accumulator++;
  render();
  createWaterFall(accumulator);
  updateWaterFall(drops);
  updateWater();
  requestAnimationFrame(loop);
}

// Initialize the scene and camera
init();
// Set up the lights
createLights();
// Build the scene
setTimeout(build, 200);
// Loop and render the scene
loop();
