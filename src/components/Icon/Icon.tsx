import React from 'react';
import './Icon.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor = 'Icy' | 'Green' | 'Yellow' | 'Red' | 'Blue' | 'Purple' | 'Magenta' | 'Tangerine' | 'White';
export type IconVariant = 'outlined' | 'filled';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: IconSize;
  color?: IconColor;
  variant?: IconVariant;
  background?: boolean;
}

// Helper function to get icon path
// For Vite, we use a path that will be resolved at build time
// In development, Vite serves files from /src, in production they're bundled
const getIconPath = (name: string): string => {
  // Vite will handle this path correctly in both dev and production
  // The path is relative to the component file
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
};

export const Icon = React.forwardRef<HTMLDivElement, IconProps>((
  { 
    name, 
    size = 'md', 
    color = 'Icy', 
    variant = 'outlined',
    background = false,
    className = '',
    ...props 
  },
  ref
) => {
  const iconPath = getIconPath(name);

  if (!iconPath) {
    console.warn(`Icon "${name}" not found in assets/icons directory`);
    return null;
  }

  const classes = [
    'icon',
    `icon--${size}`,
    `icon--${color.toLowerCase()}`,
    `icon--${variant}`,
    background && 'icon--background',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={ref}
      className={classes}
      {...props}
    >
      <img 
        src={iconPath} 
        alt={name}
        className="icon__svg"
      />
    </div>
  );
});

Icon.displayName = 'Icon';

