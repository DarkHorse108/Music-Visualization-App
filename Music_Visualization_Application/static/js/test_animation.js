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

//SCENE
var env, floor;

//SCREEN VARIABLES
var HEIGHT, WIDTH;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

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
  camera.position.x = 50;
  camera.position.z = -80;
  camera.position.y = 100;

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

  // Create a Helper Grid
  createGridHelper(scene);
}

// Add a helper grid for placement of objects
function createGridHelper(scene) {
  const size = 100;
  const divisions = 100;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);
  gridHelper.position.set(0, 0, 0);
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

  // Create directional lighting above the objects of interestand specify shadow map values
  shadowLight = new THREE.DirectionalLight(0xffe79d, 0.7);
  shadowLight.position.set(80, 120, 50);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = 0.3;
  shadowLight.shadowMapWidth = 2048;
  shadowLight.shadowMapHeight = 2048;

  // Create another directional light behind the objects of interest
  backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(200, 100, 100);
  backLight.shadowDarkness = 0.1;
  backLight.castShadow = true;

  // Add the three lights that were created
  scene.add(backLight);
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

// Create the floor of water, which is a translucent blue BoxGeometry shape
function createWater() {
  var water = new THREE.BoxGeometry(100, 100, 10);
  for (var i = 0; i < water.vertices.length; i++) {
    var vertex = water.vertices[i];
    if (vertex.z > 0) vertex.z += Math.random() * 2 - 1;
    vertex.x += Math.random() * 5 - 2.5;
    vertex.y += Math.random() * 5 - 2.5;

    vertex.wave = Math.random() * 100;
  }

  water.computeFaceNormals();
  water.computeVertexNormals();

  floor = new THREE.Mesh(
    water,
    new THREE.MeshLambertMaterial({
      color: 0x6092c1,
      shading: THREE.FlatShading,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -105;
  floor.receiveShadow = true;
  floor.name = "Floor";
  scene.add(floor);
  floor.position.set(0, 0, 0);

  // Axes Helper Function call
  setAxesHelper(floor);
}

// Create the water and add any starting objects to the scene
function build() {
  createWater();
}

// Render the Scene
function render() {
  // if (controls) controls.update();

  renderer.render(scene, camera);
}

let tick = 0;

// Iterate through each vertex of the floor/water, modify the z-axis values for each to alternate between getting larger and then smaller, to simulate movement and give the illusion of the box as a whole moving.
// Render the newly calculated water, call loop again on each frame to keep redrawing the water.
function loop() {
  render();
  tick++;

  if (floor) {
    for (var i = 0; i < floor.geometry.vertices.length; i++) {
      var vertex = floor.geometry.vertices[i];
      if (vertex.z > 0) vertex.z += Math.sin(tick * 0.015 + vertex.wave) * 0.04;
    }
    floor.geometry.verticesNeedUpdate = true;
  }

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
