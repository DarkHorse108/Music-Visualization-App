export const model = {
	cameraFOV: 80,
	cameraAspectRatio: window.innerWidth / window.innerHeight,
	cameraNearClip: 0.1,
	cameraFarClip: 1000,
	cameraPosX: 0,
	cameraPosY: 40,
	cameraPosZ: 70,
	segments: 64,
	baseRadius: 40,
	geometryArray: [],
	materialArray: [],
	segmentsArray: [],
	constructMesh: function () {
		// Construct segments individually and store in segmentsArray
		for (let i = 0; i < this.segments; i++) {
			// Initialize a geometry for a single segment
			this.geometryArray.push(
				new THREE.CircleGeometry(
					this.baseRadius,
					this.segments,
					(i * 2 * Math.PI) / this.segments,
					(2 * Math.PI) / this.segments
				)
			);

			// Initialize a material for a single segment
			this.materialArray.push(
				new THREE.MeshBasicMaterial({
					color: new THREE.Color(
						`hsl(${(i * 359) / this.segments}, 100%, 50%)`
					),
					side: 2,
				})
			);

			// Combine the geometry and material to initialize the segment
			this.segmentsArray.push(
				new THREE.Mesh(this.geometryArray[i], this.materialArray[i])
			);
		}
	},
	getMesh: function () {
		return this.segmentsArray;
	},
	updateMesh: function (globalDataArray) {
		this.segmentsArray.forEach((segment, index) => {
			let sampleLevel = 1;
			if (globalDataArray) {
				sampleLevel = globalDataArray[index] / 256;
			}
			this.segmentsArray[index].scale.set(
				0.01 + sampleLevel,
				0.01 + sampleLevel,
				1
			);
			this.segmentsArray[index].rotateZ(0.003);
		});
	},
};
