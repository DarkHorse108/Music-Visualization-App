let scene;
let camera;
let renderer;
let mesh;

export function setScene(model) {
	// Initialize scene and a perspective camera
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		model.cameraFOV,
		model.cameraAspectRatio,
		model.cameraNearClip,
		model.cameraFarClip
	);

	// Initialize WebGL renderer and insert into HTML
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Position camera
	camera.position.x = model.cameraPosX;
	camera.position.y = model.cameraPosY;
	camera.position.z = model.cameraPosZ;

	// Get mesh from animation model
	mesh = model.getMesh();

	// Add mesh to the scene
	if (Array.isArray(mesh)) {
		// Add segments to scene individually if mesh is an array of segments
		mesh.forEach((segment) => {
			scene.add(segment);
		});
	} else {
		scene.add(mesh);
	}
}

export function animate(model, globalDataArray) {
	model.updateMesh(globalDataArray);
	renderer.render(scene, camera);
}
