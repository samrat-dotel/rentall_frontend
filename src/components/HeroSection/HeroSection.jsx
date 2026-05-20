import { Link } from 'react-router-dom';
import './HeroSection.css';

const slides = [
  {
    id: 1,
    tag: 'Winter Sale',
    headline: 'Dress for the Moment.',
    sub: 'Rent premium fashion — delivered today, returned on your schedule.',
    cta: 'Shop Now',
    link: '/items',
    image: 'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bg: '#e8ddd8',
  },
  {
    id: 2,
    tag: 'New Arrivals',
    headline: 'Wear the Season.',
    sub: 'Explore hundreds of curated outfits for every occasion.',
    cta: 'Browse Items',
    link: '/items',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bg: '#dce4ec',
  },
];

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="hero" style={{ background: slide.bg }}>
      <div className="hero__inner container">
        <div className="hero__content">
          <span className="hero__tag">{slide.tag}</span>
          <h1 className="hero__headline">{slide.headline}</h1>
          <p className="hero__sub">{slide.sub}</p>
          <Link to={slide.link} className="hero__cta">{slide.cta}</Link>
        </div>
        <div className="hero__image-wrap">
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.headline}
            className="hero__image"
          />
        </div>
      </div>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === active ? ' hero__dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
