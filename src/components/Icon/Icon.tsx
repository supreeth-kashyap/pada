import React, { useState, useEffect } from 'react';
import './Icon.css';

export type IconVariant = 'stroke' | 'fill';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Material Symbols name (snake_case, e.g. `dashboard`, `inbox`, `settings`, `logout`).
   * Browse the catalog at https://fonts.google.com/icons (set "Material Symbols").
   * If the name doesn't exist in the library, nothing is rendered.
   */
  name?: string;
  /** Custom SVG source URL or raw SVG markup. Bypasses the Material Icons lookup when set. */
  src?: string;
  /** Pixel size of the icon. Defaults to 20. */
  size?: number | string;
  /** Color override. Defaults to `currentColor` so the icon inherits text color. */
  color?: string;
  /**
   * Material Icons ships several styles. The two we expose:
   * - `'stroke'` (default): the **outlined** style — lines / outlines.
   * - `'fill'`: the **filled** style — solid silhouettes.
   * The two are mutually exclusive at the asset level (we fetch a different file each way),
   * so an icon can never accidentally show both at once.
   */
  variant?: IconVariant;
}

/**
 * Material Symbols (the “new” Material icon system) ships static SVG exports per stroke
 * weight on npm as `@material-symbols/svg-{weight}`. We default to weight 200 (light),
 * grade 0 — grade is fixed at 0 in the static SVG exports, so it isn't selectable here.
 *
 * Style families: `outlined` (default), `rounded`, `sharp`.
 * Fill axis: `{name}.svg` is outline (fill 0); `{name}-fill.svg` is solid (fill 1).
 */
const MATERIAL_SYMBOLS_WEIGHT = 400;
const MATERIAL_SYMBOLS_STYLE: 'outlined' | 'rounded' | 'sharp' = 'outlined';
const MATERIAL_SYMBOLS_CDN = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-${MATERIAL_SYMBOLS_WEIGHT}@latest/${MATERIAL_SYMBOLS_STYLE}`;

const buildMaterialUrl = (name: string, variant: IconVariant) => {
  const suffix = variant === 'fill' ? '-fill' : '';
  return `${MATERIAL_SYMBOLS_CDN}/${name}${suffix}.svg`;
};

/**
 * Fetch an SVG. Returns:
 * - the raw SVG markup on success
 * - `null` if the resource is not found / not a valid SVG (so callers can render nothing).
 */
const loadSVG = async (input: string): Promise<string | null> => {
  try {
    if (input.trim().startsWith('<svg')) return input;
    const response = await fetch(input);
    if (!response.ok) return null;
    const text = await response.text();
    if (!/<svg\b/i.test(text)) return null;
    return text;
  } catch {
    return null;
  }
};

const SHAPE_SELECTOR = 'path, circle, rect, polygon, line, polyline, ellipse';

/**
 * Replace any explicit fills/strokes with `currentColor` so the icon adopts the
 * surrounding text color. Material Icons usually leave fill/stroke unset on shapes
 * (defaulting to black); we set them explicitly to keep coloring predictable.
 */
const recolorSvg = (markup: string): string => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return markup;

  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const root = doc.documentElement;
  if (!root || root.nodeName.toLowerCase() !== 'svg') return markup;

  root.querySelectorAll(SHAPE_SELECTOR).forEach((el) => {
    if (el.closest('defs')) return;
    const fill = el.getAttribute('fill');
    if (!fill || fill.toLowerCase() !== 'none') {
      el.setAttribute('fill', 'currentColor');
    }
    const stroke = el.getAttribute('stroke');
    if (stroke && stroke.toLowerCase() !== 'none') {
      el.setAttribute('stroke', 'currentColor');
    }
  });

  return new XMLSerializer().serializeToString(root);
};

export const Icon = ({
  name,
  src,
  size = 20,
  color = 'currentColor',
  variant = 'stroke',
  className = '',
  style,
  ...props
}: IconProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const iconSource = src ?? (name ? buildMaterialUrl(name, variant) : '');

  useEffect(() => {
    if (!iconSource) {
      setSvgContent(null);
      setLoadFailed(true);
      return;
    }
    let canceled = false;
    setLoadFailed(false);
    setSvgContent(null);
    loadSVG(iconSource).then((result) => {
      if (canceled) return;
      if (result === null) {
        setLoadFailed(true);
      } else {
        setSvgContent(result);
      }
    });
    return () => {
      canceled = true;
    };
  }, [iconSource]);

  // No name / src — nothing to render.
  if (!iconSource) return null;
  // Icon could not be resolved (404 from Material CDN, unknown name, network error — etc.).
  if (loadFailed) return null;

  const resolvedSize = typeof size === 'number' ? `${size}px` : size;
  const classes = ['icon', `icon--${variant}`, className].filter(Boolean).join(' ');
  const mergedStyle: React.CSSProperties = {
    width: resolvedSize,
    height: resolvedSize,
    color,
    ...style,
  };

  // Reserve layout space while the SVG is loading so the row doesn't shift when it arrives.
  if (!svgContent) {
    return <div className={classes} style={mergedStyle} aria-hidden="true" {...props} />;
  }

  return (
    <div className={classes} style={mergedStyle} {...props}>
      <div
        className="icon__svg"
        dangerouslySetInnerHTML={{ __html: recolorSvg(svgContent) }}
      />
    </div>
  );
};
