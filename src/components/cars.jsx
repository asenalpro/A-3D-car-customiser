import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { CAR_MODELS } from './carPresets';

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

export const CarModel = ({ color = '#3b82f6', wheelColor = 'default', modelId = 'street-gt', position = [0, 0, 0] }) => {
  const gltf = useGLTF('/model/car.glb');
  const model = CAR_MODELS.find((item) => item.id === modelId) || CAR_MODELS[0];

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const matName = child.material.name || '';

        // Body paint (body + stripe)
        if (BODY_MATERIAL_NAMES.includes(matName)) {
          child.material.color.set(matName === BODY_MATERIAL_NAMES[0] ? color : model.accent);
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
  }, [gltf, color, wheelColor, model]);

  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        rotation={model.rotation}
        scale={model.scale}
      />
    );
  }

  return null;
};

useGLTF.preload('/model/car.glb');