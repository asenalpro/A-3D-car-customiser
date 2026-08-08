const fs = require('fs');

const buf = fs.readFileSync('public/model/car.glb');
const dataView = new DataView(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

// GLB Header (12 bytes): magic (4), version (4), length (4)
let offset = 12;
let jsonChunk = null;
let binChunk = null;

while (offset < buf.length) {
  const chunkLength = dataView.getUint32(offset, true);
  const chunkType = dataView.getUint32(offset + 4, true);
  const chunkData = buf.slice(offset + 8, offset + 8 + chunkLength);
  
  if (chunkType === 0x4E4F534A) { // JSON
    jsonChunk = JSON.parse(chunkData.toString('utf8'));
  } else if (chunkType === 0x004E4942) { // BIN
    binChunk = chunkData;
  }
  
  offset += 8 + chunkLength;
}

if (jsonChunk) {
  console.log('=== Materials ===');
  jsonChunk.materials.forEach((mat, i) => {
    console.log(`Material ${i}:`, mat.name || 'unnamed');
    if (mat.pbrMetallicRoughness) {
      const pbr = mat.pbrMetallicRoughness;
      console.log('  baseColorFactor:', pbr.baseColorFactor);
      if (pbr.baseColorTexture) {
        console.log('  has texture index:', pbr.baseColorTexture.index);
      }
    }
  });
  
  console.log('\n=== Meshes ===');
  jsonChunk.meshes.forEach((mesh, i) => {
    console.log(`Mesh ${i}:`, mesh.name || 'unnamed');
    (mesh.primitives || []).forEach((prim, j) => {
      console.log(`  Primitive ${j}: material index =`, prim.material);
    });
  });
  
  // Also check nodes
  console.log('\n=== Nodes ===');
  jsonChunk.nodes.forEach((node, i) => {
    console.log(`Node ${i}:`, node.name || 'unnamed', 'mesh:', node.mesh);
  });
}