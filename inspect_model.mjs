import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';

const buf = fs.readFileSync('public/model/car.glb');
const buffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new GLTFLoader();
loader.parse(buffer, '', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      console.log('Mesh name:', child.name);
      console.log('  Material name:', child.material?.name);
      console.log('  Color hex:', child.material?.color?.getHexString());
      console.log('  Color style:', child.material?.color?.getStyle());
      console.log('  Emissive:', child.material?.emissive?.getHexString());
      console.log('  Metalness:', child.material?.metalness);
      console.log('  Roughness:', child.material?.roughness);
      console.log('  ----');
    }
  });
}, undefined, (err) => {
  console.error('Error:', err);
});