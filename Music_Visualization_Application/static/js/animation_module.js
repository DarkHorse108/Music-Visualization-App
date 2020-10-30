// Initialize object to store circle properties
const circle = {
	segments: 64,
	baseRadius: 40,
	geometryArray: [],
};

// Initialize array to store material of circle (color and side)
let materialArray = [];

// Initialize array to store circle segments (slices)
let segmentsArray = [];

// Initialize scene and a perspective camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	80,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Initialize WebGL renderer and insert into HTML
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position camera
camera.position.x = 0;
camera.position.y = 40;
camera.position.z = 70;

// Construct circle segments individually and store in segmentsArray
for (let i = 0; i < circle.segments; i++) {
	// Initialize a geometry for a single segment
	circle.geometryArray.push(
		new THREE.CircleGeometry(
			circle.baseRadius,
			64,
			(i * 2 * Math.PI) / circle.segments,
			(2 * Math.PI) / circle.segments
		)
	);

	// Initialize a material for a single segment
	materialArray.push(
		new THREE.MeshBasicMaterial({
			color: new THREE.Color(
				`hsl(${(i * 359) / circle.segments}, 100%, 50%)`
			),
			side: 2,
		})
	);

	// Combine the geometry and material to initialize the segment
	segmentsArray.push(
		new THREE.Mesh(circle.geometryArray[i], materialArray[i])
	);

	// Add segment to the scene
	scene.add(segmentsArray[i]);
}

function updateCircleSegments(soundDataArray) {
	segmentsArray.forEach((segment, index) => {
		let sampleLevel = 1;
		if (soundDataArray) {
			sampleLevel = soundDataArray[index] / 256;
		}
		segmentsArray[index].scale.set(
			0.01 + sampleLevel,
			0.01 + sampleLevel,
			1
		);
		segmentsArray[index].rotateZ(0.003);
	});
}

export function animate(globalDataArray) {
	updateCircleSegments(globalDataArray);
	renderer.render(scene, camera);
}
