import React, { useState, useEffect } from 'react';
import './Icon.css';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: number | string;
  color?: string;
}

// Helper function to get icon path
const getIconPath = (name: string): string => {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
};

const MATERIAL_ICON_FONT = 'Material Icons';
let materialFontLoaded = false;

const ensureMaterialFont = () => {
  if (materialFontLoaded || typeof document === 'undefined') return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
  materialFontLoaded = true;
};

const toMaterialSvg = (glyph: string) => {
  const content = /^[0-9a-fA-F]{4,6}$/.test(glyph) ? `&#x${glyph};` : glyph;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <text x="12" y="20" text-anchor="middle" font-family="${MATERIAL_ICON_FONT}" font-size="24">${content}</text>
    </svg>
  `;
};

const loadSVG = async (input: string): Promise<string | null> => {
  try {
    if (input.trim().startsWith('<svg')) {
      return input;
    }
    if (/^[0-9a-fA-F]{4,6}$/.test(input) || /^[a-z0-9_]+$/i.test(input)) {
      ensureMaterialFont();
      return toMaterialSvg(input);
    }
    const response = await fetch(input);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.warn(`Failed to load SVG from ${input}:`, error);
    return null;
  }
};

export const Icon = ({ 
  name,
  src,
  size = 20,
  color = 'currentColor',
  className = '',
  style,
  ...props 
}: IconProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const iconSource = src ?? (name ? getIconPath(name) : '');

  useEffect(() => {
    if (iconSource) {
      loadSVG(iconSource).then(setSvgContent);
    }
  }, [iconSource]);

  if (!iconSource) {
    console.warn('Icon requires either a "name" or "src" prop.');
    return null;
  }

  const resolvedSize = typeof size === 'number' ? `${size}px` : size;

  const classes = ['icon', className].filter(Boolean).join(' ');
  const mergedStyle = {
    width: resolvedSize,
    height: resolvedSize,
    color,
    ...style,
  };

  if (!svgContent) {
    return (
      <div className={classes} style={mergedStyle} {...props}>
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
    <div className={classes} style={mergedStyle} {...props}>
      <div 
        className="icon__svg"
        dangerouslySetInnerHTML={{ __html: coloredSVG }}
      />
    </div>
  );
};
