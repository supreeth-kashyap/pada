import React from 'react';
import './Logo.css';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: LogoSize;
  background?: boolean;
  tooltip?: string;
}

// Helper function to get logo path
// Logo files are named like "name=accelo.svg" in the assets/logos directory
const getLogoPath = (name: string): string => {
  // Vite will handle this path correctly in both dev and production
  // The path is relative to the component file
  return new URL(`../../assets/logos/name=${name}.svg`, import.meta.url).href;
};

/** A third-party brand logo (Slack, GitHub, …) from the bundled logo library, by name. */
export const BrandLogo = React.forwardRef<HTMLDivElement, BrandLogoProps>((
  { 
    name, 
    size = 'md', 
    background = false,
    tooltip,
    className = '',
    ...props 
  },
  ref
) => {
  const logoPath = getLogoPath(name);

  if (!logoPath) {
    console.warn(`Logo "${name}" not found in assets/logos directory`);
    return null;
  }

  const classes = [
    'logo',
    `logo--${size}`,
    background && 'logo--background',
    className
  ].filter(Boolean).join(' ');

  const logoElement = (
    <div 
      ref={ref}
      className={classes}
      {...props}
    >
      <img 
        src={logoPath} 
        alt={name}
        className="logo__img"
      />
      {tooltip && (
        <div className="logo__tooltip">
          {tooltip}
        </div>
      )}
    </div>
  );

  return logoElement;
});

BrandLogo.displayName = 'BrandLogo';

/** @deprecated Renamed to `BrandLogo` (Pada's own logo is `PadaLogo`). Removed in 3.0. */
export const Logo = BrandLogo;
/** @deprecated Renamed to `BrandLogoProps`. */
export type LogoProps = BrandLogoProps;

