import {
  MeshBasicMaterial,
  Mesh,
  SphereBufferGeometry,
} from "../../three.module.js";
import { getRandomFloat } from "../buildWorld.js";
export { createFireFly };

function createFireFly(fireFlyNumber) {
  const material = new MeshBasicMaterial({
    color: 0xf0e68c,
  });

  const geometry = new SphereBufferGeometry(0.25, 5, 5);

  const mesh = new Mesh(geometry, material);

  const xRange = { min: -40, max: 45 };
  const yRange = { min: 8, max: 20 };
  const zRange = { min: -60, max: 40 };
  const randomX = getRandomFloat(xRange.min, xRange.max);
  const randomY = getRandomFloat(yRange.min, yRange.max);
  const randomZ = getRandomFloat(zRange.min, zRange.max);

  mesh.position.set(randomX, randomY, randomZ);

  mesh.updateFlag = false;

  mesh.fireFlyId = fireFlyNumber;

  mesh.maxGain = 0;

  mesh.update = (freqArray) => {
    let intensity = freqArray[mesh.fireFlyId] / 255;
    let currentX = mesh.position.x;
    let currentZ = mesh.position.z;
    let nextX = currentX + 0.03;
    let nextZ = currentZ + 0.03;

    if (intensity > 0) {
      mesh.updateFlag = true;
      // mesh.position.y = randomY + intensity * mesh.maxGain;
      if (mesh.fireFlyId <= 30) {
        mesh.material.color.setRGB(
          intensity * 2 + 0.1,
          intensity * 1,
          intensity * 1
        );
        mesh.maxGain = 20;
      } else if (31 <= mesh.fireFlyId && mesh.fireFlyId <= 60) {
        mesh.material.color.setRGB(
          intensity * 1,
          intensity * 1,
          intensity * 2 + 0.1
        );
        mesh.maxGain = 15;
      } else if (61 <= mesh.fireFlyId && mesh.fireFlyId <= 99) {
        mesh.material.color.setRGB(0.07, intensity + 0.2, 0.96);
        mesh.maxGain = 10;
      }
      mesh.position.y = randomY + intensity * mesh.maxGain;
    } else {
      mesh.material.color.setHex(0xf0e68c);
      mesh.updateFlag = false;
    }

    if (
      nextZ < zRange.min ||
      nextZ > zRange.max ||
      nextX < xRange.min ||
      nextX > xRange.max
    ) {
      nextZ = getRandomFloat(zRange.min, zRange.max);
      nextX = getRandomFloat(xRange.min, xRange.max);
    }

    mesh.position.z = nextZ;
    mesh.position.x = nextX;
  };

  return mesh;
}
