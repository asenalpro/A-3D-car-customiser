import React, { useState, useEffect } from 'react';
import art1 from '../assets/art1.png';
import art2 from '../assets/art2.png';
import art3 from '../assets/art3.png';

const ArtSlideshow = ({ theme, onClick }) => {
  const [index, setIndex] = useState(0);
  const images = [art1, art2, art3];

  // Automatic slideshow timer
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4000ms = 4 seconds
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div 
      onClick={onClick}
      style={{ 
        flex: 1, 
        position: 'relative',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: `url(${images[index]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
        borderLeft: `1px solid ${theme.border}`,
        borderRight: `1px solid ${theme.border}`,
        transition: 'background-image 0.5s ease-in-out' // Smooth transition
      }}
    >
      {/* Click Overlay Text */}
      <div style={{ 
        position: 'absolute',
        top: '30px',
        padding: '12px 24px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#fff',
        border: `1px solid ${theme.border}`,
        pointerEvents: 'none', // Lets clicks pass through to the parent
        zIndex: 10
      }}>
        Click to enter garage
      </div>
    </div>
  );
};

export default ArtSlideshow;    