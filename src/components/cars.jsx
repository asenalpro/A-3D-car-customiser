import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// Body paint materials (body + stripe) — gets recolored
const BODY_MATERIAL_NAMES = ['z28MI_Exhaust1', 'z28MI_1080040001_002'];

// Wheel finishes — recolors the existing wheel geometry
const WHEEL_PAINT = {
  default: { color: null, metalness: null, roughness: null },
  bronze:  { color: '#b45309', metalness: 0.85, roughness: 0.2 },
  silver:  { color: '#e2e8f0', metalness: 0.9,  roughness: 0.15 },
  white:   { color: '#f8fafc', metalness: 0.75, roughness: 0.2 },
};

const RIM_MATERIAL = 'z28MI_ChangeA_Rim1';
const BRAKE_MATERIAL = 'z28MI_ChangeA_Brake1';

export const CarModel = ({ color = '#3b82f6', wheelColor = 'default', position = [0, 0, 0] }) => {
  let gltf;
  try {
    gltf = useGLTF('/model/car.glb');
  } catch (e) {
    console.warn("Model not found, using fallback.");
  }

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const matName = child.material.name || '';

        // Body paint (body + stripe)
        if (BODY_MATERIAL_NAMES.includes(matName)) {
          child.material.color.set(color);
        }

        // Wheel finish
        if (matName === RIM_MATERIAL || matName === BRAKE_MATERIAL) {
          const paint = WHEEL_PAINT[wheelColor];
          if (paint && paint.color) {
            child.material.color.set(paint.color);
            if (paint.metalness !== null) child.material.metalness = paint.metalness;
            if (paint.roughness !== null) child.material.roughness = paint.roughness;
          }
        }
      }
    });
  }, [gltf, color, wheelColor]);

  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={50}
      />
    );
  }

  // Fallback if model fails to load
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

useGLTF.preload('/model/car.glb');