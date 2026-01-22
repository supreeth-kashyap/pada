import React, { useEffect, useMemo, useState } from 'react';
import './Carousel.css';
import { Button } from '../Button';

export interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showDots?: boolean;
  showNav?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  interval = 3000,
  className = '',
  showDots = true,
  showNav = true
}) => {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, interval, totalSlides]);

  const handlePrev = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className={`carousel ${className}`.trim()}>
      {showNav && (
        <div className="carousel__nav carousel__nav--left">
          <Button
            className="carousel__nav-button"
            size="sm"
            variant="tertiary"
            leftIcon="chevron_left"
            onClick={handlePrev}
            disabled={totalSlides <= 1}
            aria-label="Previous slide"
          >
            {''}
          </Button>
        </div>
      )}

      <div className="carousel__center">
        <div className="carousel__viewport">
          <div className="carousel__slide">
            {slides[currentIndex]}
          </div>
        </div>
        {showDots && totalSlides > 1 && (
          <div className="carousel__dots" role="tablist" aria-label="Carousel slides">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                className={`carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}`.trim()}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentIndex}
              />
            ))}
          </div>
        )}
      </div>

      {showNav && (
        <div className="carousel__nav carousel__nav--right">
          <Button
            className="carousel__nav-button"
            size="sm"
            variant="tertiary"
            leftIcon="chevron_right"
            onClick={handleNext}
            disabled={totalSlides <= 1}
            aria-label="Next slide"
          >
            {''}
          </Button>
        </div>
      )}
    </div>
  );
};
