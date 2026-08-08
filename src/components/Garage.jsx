import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, Html } from '@react-three/drei';
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

const WHEEL_COLORS = [
  { id: 'default', name: 'Default', hex: '#111827' },
  { id: 'bronze', name: 'Bronze', hex: '#b45309' },
  { id: 'silver', name: 'Silver', hex: '#cbd5e1' },
  { id: 'white', name: 'White', hex: '#ffffff' },
];

// ______________________ GARAGE SCENE (tight, no void peek) ______________________
function GarageScene({ carColor, wheelColor }) {
  const colorName = COLORS.find(c => c.hex === carColor)?.name || 'Custom';
  const wheelName = WHEEL_COLORS.find(w => w.id === wheelColor)?.name || 'Default';
  const wheelHex = WHEEL_COLORS.find(w => w.id === wheelColor)?.hex || '#cbd5e1';

  return (
    <>
      <hemisphereLight intensity={2} color="#ffffff" groundColor="#999999" />
      <ambientLight intensity={2.2} />
      <directionalLight position={[4, 6, 4]} intensity={3.5} castShadow shadow-mapSize={[1024, 1024]} />

      {/* Concrete floor — tight to room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -1]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Skid marks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.5]}>
        <planeGeometry args={[1.8, 4]} />
        <meshBasicMaterial color="#232323" transparent opacity={0.6} />
      </mesh>

      {/* Back wall — pulled in to z=-5 */}
      <mesh position={[0, 2.2, -5]}>
        <boxGeometry args={[13, 5.5, 0.5]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.7} />
      </mesh>

      {/* Front wall — behind camera so it doesn't block, but no void escape */}
      <mesh position={[0, 2.2, 5.2]}>
        <boxGeometry args={[13, 5.5, 0.5]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.7} />
      </mesh>

      {/* Side walls — pulled in to x=±6 */}
      <mesh position={[-6.2, 2.2, -0.5]}>
        <boxGeometry args={[0.5, 5.5, 11]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.7} />
      </mesh>
      <mesh position={[6.2, 2.2, -0.5]}>
        <boxGeometry args={[0.5, 5.5, 11]} />
        <meshStandardMaterial color="#2b2d31" roughness={0.7} />
      </mesh>

      {/* Ceiling — lower */}
      <mesh position={[0, 4.5, -0.5]}>
        <boxGeometry args={[13, 0.2, 12]} />
        <meshStandardMaterial color="#262626" roughness={0.8} />
      </mesh>

      {/* Neon strip on ceiling */}
      <mesh position={[0, 4.4, -0.5]}>
        <boxGeometry args={[10, 0.06, 0.06]} />
        <meshBasicMaterial color="#ff4040" />
      </mesh>

      {/* GARAGE sign — LOWER, above back wall, facing camera */}
      <Html position={[0, 3.6, -4.7]} center transform occlude={false}>
        <div style={{
          color: '#ff3b30',
          fontSize: '2.4rem',
          fontWeight: '900',
          letterSpacing: '0.35em',
          fontFamily: '"Bangers", "Trebuchet MS", sans-serif',
          textShadow: '0 0 14px rgba(255,59,48,0.95), 0 0 40px rgba(255,59,48,0.4)',
          whiteSpace: 'nowrap'
        }}>
          GARAGE
        </div>
      </Html>

      {/* ________ CONFIG TOOLTIP — pinned to the car ROOF ________ */}
      <Html position={[0, 0.75, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            fontFamily: '"Bangers", "Trebuchet MS", sans-serif',
            letterSpacing: '0.05em',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <div>PAINT: <span style={{ color: carColor, fontWeight: '900' }}>{colorName}</span></div>
            <div style={{ marginTop: '2px' }}>
              WHEELS: <span style={{ color: wheelHex, fontWeight: '900' }}>{wheelName}</span>
            </div>
          </div>
          {/* line touching the roof of the car */}
          <div style={{ width: 2, height: 22, backgroundColor: 'rgba(255,255,255,0.35)', marginTop: '2px' }} />
        </div>
      </Html>

      {/* Neon floor line to car */}
      <mesh position={[0, 0.01, -1]}>\n        <planeGeometry args={[0.04, 2.5]} />
        <meshBasicMaterial color={carColor} transparent opacity={0.7} />
      </mesh>


    </>
  );
}

const Garage = ({ onBack }) => {
  const [lights, setLights] = useState([]);
  const [carColor, setCarColor] = useState('#3b82f6');
  const [wheelColor, setWheelColor] = useState('default');
  const [showPalette, setShowPalette] = useState(false);
  const [showWheels, setShowWheels] = useState(false);
  const MAX_LIGHTS = 3;

  const addSpotlight = () => {
    if (lights.length < MAX_LIGHTS) {
      const newLight = { id: Date.now(), position: [2, 3, 2] };
      setLights([...lights, newLight]);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, backgroundColor: '#000', fontFamily: '"Bangers", "Trebuchet MS", "Comic Sans MS", cursive, sans-serif' }}>
      
      <button onClick={onBack} style={backButtonStyle}>← Back</button>

      <Canvas shadows camera={{ position: [3, 2.5, 4], fov: 45 }} dpr={[1, 1.5]} frameloop="demand">
        <Suspense fallback={null}>
          <GarageScene carColor={carColor} wheelColor={wheelColor} />
          <CarModel color={carColor} wheelColor={wheelColor} />
        </Suspense>

        {lights.map((light) => (
          <TransformControls key={light.id} position={light.position}>
             <pointLight intensity={10} distance={12} color="white" />
             <mesh>
               <sphereGeometry args={[0.2, 16, 16]} />
               <meshBasicMaterial color="yellow" />
             </mesh>
          </TransformControls>
        ))}

        <OrbitControls
          makeDefault
          maxPolarAngle={Math.PI / 2 - 0.05}
          /* CANNOT zoom out beyond the opening view — only zoom in closer */
          minDistance={0.5}
          maxDistance={5.6}
        />
      </Canvas>

      <div style={bottomActionBarStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '14px 20px' }}>
          <div style={{ color: 'white', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '1.05rem', textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
            Customisation
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              style={{ ...buttonStyle, backgroundColor: showPalette ? '#6b21a8' : '#8b5cf6', padding: '10px 14px' }}
              onClick={() => { setShowPalette(!showPalette); setShowWheels(false); }}
            >
              {showPalette ? 'Close Palette' : 'Colour'}
            </button>

            <button
              style={{ ...buttonStyle, backgroundColor: showWheels ? '#065f46' : '#0d9488', padding: '10px 14px' }}
              onClick={() => { setShowWheels(!showWheels); setShowPalette(false); }}
            >
              {showWheels ? 'Close Wheels' : 'Wheel Colour'}
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

        {showWheels && (
          <div style={{
            padding: '10px 20px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            borderTop: '1px solid #374151',
            paddingTop: '14px'
          }}>
            {WHEEL_COLORS.map((r) => (
              <button
                key={r.id}
                onClick={() => setWheelColor(r.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: wheelColor === r.id ? '#0ea5e9' : '#334155',
                  padding: '10px 18px',
                  borderRadius: '24px',
                  border: wheelColor === r.id ? '2px solid white' : '2px solid transparent',
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '0 20px 14px', color: '#d1d5db', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', fontStyle: 'italic' }}>
          <span>Spotlights: {lights.length} / {MAX_LIGHTS}</span>
          <span>Colour: {COLORS.find(c => c.hex === carColor)?.name || 'Custom'}  |  Wheels: {WHEEL_COLORS.find(r => r.id === wheelColor)?.name || 'Default'}</span>
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