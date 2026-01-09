import React, { useState, useEffect } from 'react';
import './Icon.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor = 'Icy' | 'Green' | 'Yellow' | 'Red' | 'Blue' | 'Purple' | 'Magenta' | 'Tangerine' | 'White' | 'Indigo' | 'Teal' | 'Cyan';
export type IconVariant = 'outlined' | 'filled';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: IconSize;
  color?: IconColor;
  variant?: IconVariant;
  background?: boolean;
}

// Helper function to get icon path
const getIconPath = (name: string): string => {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
};

// Fetch and load SVG content
const loadSVG = async (path: string): Promise<string | null> => {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.warn(`Failed to load SVG from ${path}:`, error);
    return null;
  }
};

export const Icon = ({ 
  name, 
  size = 'md', 
  color = 'Icy', 
  variant = 'outlined',
  background = false,
  className = '',
  ...props 
}: IconProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const iconPath = getIconPath(name);

  useEffect(() => {
    if (iconPath) {
      loadSVG(iconPath).then(setSvgContent);
    }
  }, [iconPath]);

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

  if (!svgContent) {
    return (
      <div 
        className={classes}
        {...props}
      >
        <div className="icon__svg" />
      </div>
    );
  }

  // Inject color variable into SVG
  const coloredSVG = svgContent.replace(
    /(stroke|fill)="[^"]*"/g,
    (match, attr) => {
      if (attr === 'stroke' && svgContent.includes('stroke=')) {
        return `${attr}="currentColor"`;
      }
      if (attr === 'fill' && svgContent.includes('fill=')) {
        return `${attr}="currentColor"`;
      }
      return match;
    }
  );

  return (
    <div 
      className={classes}
      {...props}
    >
      <div 
        className="icon__svg"
        dangerouslySetInnerHTML={{ __html: coloredSVG }}
      />
    </div>
  );
};
