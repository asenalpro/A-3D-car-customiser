import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';

const CarConfigurator = ({ onBack }) => {
  const [lights, setLights] = useState([]);
  const [carColor, setCarColor] = useState('#22c55e');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [rimType, setRimType] = useState('Standard');
  
  const MAX_LIGHTS = 3;

  const addSpotlight = () => {
    if (lights.length < MAX_LIGHTS) {
      setLights([...lights, { id: Date.now(), position: [2, 2, 2] }]);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, backgroundColor: '#000' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack} 
        style={{
          position: 'absolute', top: '20px', left: '20px', zIndex: 100,
          padding: '10px 20px', backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease'
        }}
      >
        ← Back
      </button>

      <Canvas shadows camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

        {lights.map((light) => (
          <TransformControls key={light.id} position={light.position} showX showY showZ>
            <pointLight intensity={5} distance={10} />
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
          </TransformControls>
        ))}

        <Grid infiniteGrid fadeDistance={50} sectionColor={"#444"} cellColor={"#222"} />

        {/* Car Body */}
        <mesh position={[0, 0.5, 0]} castShadow> 
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color={carColor} roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Spoiler */}
        {hasSpoiler && (
          <mesh position={[0, 1.1, -0.8]} castShadow>
            <boxGeometry args={[1, 0.1, 0.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        )}

        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{ 
        position: 'absolute', top: '80px', right: '20px', zIndex: 10,
        width: '280px', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.8)', 
        borderRadius: '16px', border: '1px solid #374151', backdropFilter: 'blur(8px)',
        color: '#ffffff', fontFamily: 'sans-serif'
      }}>
        <h3 style={{ marginTop: 0 }}>Customisation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
                    <button style={buttonStyle} onClick={() => setCarColor(carColor === '#3b82f6' ? '#ef4444' : '#3b82f6')}>
            Change Colour
          </button>
          
          <button style={buttonStyle} onClick={() => setRimType(rimType === 'Standard' ? 'Sport' : 'Standard')}>
            Change Rim ({rimType})
          </button>
          
          <button style={buttonStyle} onClick={() => setHasSpoiler(!hasSpoiler)}>
            {hasSpoiler ? 'Remove Spoiler' : 'Add Spoiler'}
          </button>
          
          <hr style={{ width: '100%', borderColor: '#374151', margin: '10px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Spotlights</span>
            <span style={{ fontSize: '0.9rem', color: lights.length === MAX_LIGHTS ? '#ef4444' : '#9ca3af' }}>
              {lights.length} / {MAX_LIGHTS}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={addSpotlight} 
              disabled={lights.length >= MAX_LIGHTS}
              style={{...buttonStyle, backgroundColor: lights.length >= MAX_LIGHTS ? '#4b5563' : '#eab308', flex: 2, cursor: lights.length >= MAX_LIGHTS ? 'not-allowed' : 'pointer'}}
            >
              {lights.length >= MAX_LIGHTS ? 'Limit Reached' : '+ Spotlight'}
            </button>
            <button onClick={() => setLights([])} style={{...buttonStyle, backgroundColor: '#ef4444', flex: 1}}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px', backgroundColor: '#3b82f6', color: 'white',
  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
};

export default CarConfigurator;