const fs = require('fs');
const content = `import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import { CarModel } from './cars';

const COLORS = [
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#eab308', name: 'Yellow' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#22c55e', name: 'Green' },
  { hex: '#1f2937', name: 'Black' },
];

const RIMS = [
  { id: 'default', name: 'Default' },
  { id: 'te37', name: 'TE37' },
  { id: 'rpf1', name: 'RPF1' },
  { id: 'bbs', name: 'BBS RS' },
];

const Garage = ({ onBack }) => {
  const [lights, setLights] = useState([]);
  const [carColor, setCarColor] = useState('#3b82f6');
  const [rimType, setRimType] = useState('default');
  const [showPalette, setShowPalette] = useState(false);
  const [showRims, setShowRims] = useState(false);
  const MAX_LIGHTS = 3;

  const addSpotlight = () => {
    if (lights.length < MAX_LIGHTS) {
      const newLight = { id: Date.now(), position: [2, 3, 2] };
      setLights([...lights, newLight]);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, backgroundColor: '#000', fontFamily: '"Bangers", "Trebuchet MS", "Comic Sans MS", cursive, sans-serif' }}>
      
      <button onClick={onBack} style={backButtonStyle}>\u2190 Back</button>

      <Canvas shadows camera={{ position: [3, 2, 3], fov: 45 }}>
        <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#444444" />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
        <Grid infiniteGrid fadeDistance={50} sectionColor={"#888"} cellColor={"#444"} />
        
        <Suspense fallback={null}>
          <CarModel color={carColor} rimType={rimType} />
        </Suspense>

        {lights.map((light) => (
          <TransformControls key={light.id} position={light.position}>
             <pointLight intensity={10} distance={10} color="white" />
             <mesh>
               <sphereGeometry args={[0.2, 16, 16]} />
               <meshBasicMaterial color="yellow" />
             </mesh>
          </TransformControls>
        ))}

        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      </Canvas>

      <div style={bottomActionBarStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '14px 20px' }}>
          <div style={{ color: 'white', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '1.05rem', textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
            Customisation
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              style={{ ...buttonStyle, backgroundColor: showPalette ? '#6b21a8' : '#8b5cf6', padding: '10px 14px' }}
              onClick={() => { setShowPalette(!showPalette); setShowRims(false); }}
            >
              {showPalette ? 'Close Palette' : 'Colour'}
            </button>

            <button
              style={{ ...buttonStyle, backgroundColor: showRims ? '#065f46' : '#0d9488', padding: '10px 14px' }}
              onClick={() => { setShowRims(!showRims); setShowPalette(false); }}
            >
              {showRims ? 'Close Rims' : 'Rims'}
            </button>

            <button
              onClick={addSpotlight}
              disabled={lights.length >= MAX_LIGHTS}
              style={{ ...buttonStyle, backgroundColor: '#10b981', padding: '10px 14px' }}
            >
              + Spotlight
            </button>

            <button
              onClick={() => setLights([])}
              style={{ ...buttonStyle, backgroundColor: '#ef4444', padding: '10px 14px' }}
            >
              Reset
            </button>
          </div>
        </div>

        {showPalette && (
          <div style={{
            padding: '10px 20px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            borderTop: '1px solid #374151',
            paddingTop: '14px'
          }}>
            {COLORS.map((c) => (
              <div
                key={c.hex}
                onClick={() => setCarColor(c.hex)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  transform: carColor === c.hex ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: carColor === c.hex
                    ? '3px solid white'
                    : '2px solid rgba(255,255,255,0.3)',
                  boxShadow: carColor === c.hex
                    ? `0 0 16px ${c.hex}80`
                    : 'none',
                  transition: 'all 0.2s ease',
                }} />
                <span style={{
                  color: carColor === c.hex ? 'white' : '#9ca3af',
                  fontSize: '0.7rem',
                  fontWeight: carColor === c.hex ? '700' : '400',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                }}>
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {showRims && (
          <div style={{
            padding: '10px 20px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            borderTop: '1px solid #374151',
            paddingTop: '14px'
          }}>
            {RIMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRimType(r.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: rimType === r.id ? '#0ea5e9' : '#334155',
                  padding: '10px 18px',
                  borderRadius: '24px',
                  border: rimType === r.id ? '2px solid white' : '2px solid transparent',
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '0 20px 14px', color: '#d1d5db', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', fontStyle: 'italic' }}>
          <span>Spotlights: {lights.length} / {MAX_LIGHTS}</span>
          <span>Colour: {COLORS.find(c => c.hex === carColor)?.name || 'Custom'}  |  Rims: {RIMS.find(r => r.id === rimType)?.name || 'Default'}</span>
        </div>
      </div>
    </div>
  );
};

const backButtonStyle = {
  position: 'absolute', top: '20px', left: '20px', zIndex: 100,
  padding: '10px 20px', backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: '"Bangers", "Trebuchet MS", "Comic Sans MS", cursive, sans-serif'
};

const bottomActionBarStyle = {
  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
  backgroundColor: 'rgba(17, 24, 39, 0.95)', borderTop: '1px solid #374151',
  boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.35)'
};

const buttonStyle = {
  padding: '10px', backgroundColor: '#3b82f6', color: 'white',
  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700',
  fontFamily: '"Bangers", "Trebuchet MS", "Comic Sans MS", cursive, sans-serif', letterSpacing: '0.03em'
};

export default Garage;
`;
fs.writeFileSync('vite-project/src/components/Garage.jsx', content.replace(/\\u2190/g, '\u2190'), 'utf8');
console.log('Garage.jsx written OK');
