import { useEffect, useState } from 'react';
import art1 from '../assets/art1.png';
import art2 from '../assets/art2.png';
import art3 from '../assets/art3.png';

const ArtSlideshow = ({ onClick }) => {
  const [index, setIndex] = useState(0);
  const images = [art1, art2, art3];

  useEffect(() => {
    const interval = setInterval(() => setIndex((previous) => (previous + 1) % images.length), 4500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <button
      className="feature-card"
      onClick={onClick}
      style={{ backgroundImage: `url(${images[index]})` }}
      aria-label="Open your custom garage"
    >
      <span className="feature-shade" />
      <span className="feature-content">
        <span className="eyebrow">Your featured build</span>
        <strong>Make it unmistakably yours.</strong>
        <span className="feature-cta">Enter customizer <span>↗</span></span>
      </span>
      <span className="slide-dots">
        {images.map((image, dotIndex) => <i className={dotIndex === index ? 'selected' : ''} key={image} />)}
      </span>
    </button>
  );
};

export default ArtSlideshow;
