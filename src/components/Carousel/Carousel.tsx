import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import './Carousel.css';
import { Button } from '../Button';
import { Icon } from '../Icon';

export interface CarouselProps {
  children: React.ReactNode;
  /** Advance automatically. Pauses on hover and focus, and never runs under reduced motion. */
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showDots?: boolean;
  showNav?: boolean;
  /** Accessible name of the carousel region. */
  label?: string;
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const prefersReducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.(REDUCED_MOTION).matches;

/**
 * A rotating set of slides (WAI-ARIA APG Carousel). Auto-rotation pauses while the pointer or
 * keyboard focus is inside it, can be paused with its rotation button, and is off when the user
 * prefers reduced motion.
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  interval = 3000,
  className = '',
  showDots = true,
  showNav = true,
  label = 'Carousel',
}) => {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const totalSlides = slides.length;
  const canRotate = autoPlay && totalSlides > 1 && !reducedMotion;
  const rotating = canRotate && !paused && !hovered && !focused;

  useEffect(() => {
    if (!rotating) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, interval);
    return () => window.clearInterval(timer);
  }, [rotating, interval, totalSlides]);

  const handlePrev = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section
      className={`carousel ${className}`.trim()}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {showNav && (
        <div className="carousel__nav carousel__nav--left">
          <Button
            className="carousel__nav-button"
            variant="ghost"
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
        {/* Announce slide changes only when they come from the user, not from auto-rotation. */}
        <div className="carousel__viewport" aria-live={rotating ? 'off' : 'polite'}>
          <div
            key={currentIndex}
            className="carousel__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${currentIndex + 1} of ${totalSlides}`}
          >
            {slides[currentIndex]}
          </div>
        </div>
        {(showDots || canRotate) && totalSlides > 1 && (
          <div className="carousel__controls">
            {canRotate && (
              <button
                type="button"
                className="carousel__rotation"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? 'Start automatic slide show' : 'Stop automatic slide show'}
              >
                <Icon name={paused ? 'play' : 'pause'} size={10} aria-hidden="true" />
              </button>
            )}
            {showDots && (
              <div className="carousel__dots">
                {slides.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    className="carousel__dot"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Slide ${index + 1}`}
                    aria-current={index === currentIndex || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showNav && (
        <div className="carousel__nav carousel__nav--right">
          <Button
            className="carousel__nav-button"
            variant="ghost"
            leftIcon="chevron_right"
            onClick={handleNext}
            disabled={totalSlides <= 1}
            aria-label="Next slide"
          >
            {''}
          </Button>
        </div>
      )}
    </section>
  );
};
