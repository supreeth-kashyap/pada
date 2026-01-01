import React from 'react';
import './Logo.css';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
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

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>((
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

Logo.displayName = 'Logo';

