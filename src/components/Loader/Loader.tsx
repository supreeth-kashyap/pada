import React from 'react';
import './Loader.css';

const loaderSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32
} as const;

export type LoaderSize = keyof typeof loaderSizes;

export interface LoaderProps {
  size?: LoaderSize;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'xs', className = '' }) => {
  const resolvedSize = loaderSizes[size];

  return (
    <div
      className={`loader loader--${size} ${className}`.trim()}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        '--loader-radius': `${resolvedSize / 2}px`,
        '--loader-bar-width': `${(4 / 32) * resolvedSize}px`,
        '--loader-bar-height': `${(8 / 32) * resolvedSize}px`,
        '--loader-bar-radius': `${(2 / 32) * resolvedSize}px`
      } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    >
      <span className="loader__spinner" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            className="loader__bar"
            style={{
              '--loader-rotation': `${index * 22.5}deg`,
              '--loader-opacity': `${1 - index * 0.04}`,
              animationDelay: `${index * 0.1}s`
            } as React.CSSProperties}
          />
        ))}
      </span>
    </div>
  );
};
