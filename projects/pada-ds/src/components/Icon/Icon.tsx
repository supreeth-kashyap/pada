import React, { useState, useEffect, useMemo } from 'react';
import { getBuiltInIcon } from './iconRegistry';
import './Icon.css';

export type IconVariant = 'stroke' | 'fill';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon name (snake_case). Built-in names (see the exported `iconNames`, e.g. `tick_1`,
   * `chevron_down`, `cross_1`, `search`) are bundled with the library and render
   * synchronously — no network request, and they work during SSR.
   *
   * Any other name falls back to Material Symbols, fetched from a CDN
   * (browse https://fonts.google.com/icons, set "Material Symbols").
   * If the name doesn't resolve in either place, nothing is rendered.
   */
  name?: string;
  /** Custom SVG source URL or raw SVG markup. Takes precedence over `name` when set. */
  src?: string;
  /** Pixel size of the icon. Defaults to 20. */
  size?: number | string;
  /** Color override. Defaults to `currentColor` so the icon inherits text color. */
  color?: string;
  /**
   * Only applies to the Material Symbols fallback, which ships several styles. The two we expose:
   * - `'stroke'` (default): the **outlined** style — lines / outlines.
   * - `'fill'`: the **filled** style — solid silhouettes.
   * The two are mutually exclusive at the asset level (we fetch a different file each way),
   * so an icon can never accidentally show both at once. Built-in icons have one style.
   */
  variant?: IconVariant;
}

/**
 * Material Symbols (the “new” Material icon system) ships static SVG exports per stroke
 * weight on npm as `@material-symbols/svg-{weight}`. We use weight 400, grade 0 — grade
 * is fixed at 0 in the static SVG exports, so it isn't selectable here. The package
 * version is pinned so a new release can't silently change or remove a glyph.
 *
 * Style families: `outlined` (default), `rounded`, `sharp`.
 * Fill axis: `{name}.svg` is outline (fill 0); `{name}-fill.svg` is solid (fill 1).
 */
const MATERIAL_SYMBOLS_WEIGHT = 400;
const MATERIAL_SYMBOLS_VERSION = '0.27.0';
const MATERIAL_SYMBOLS_STYLE: 'outlined' | 'rounded' | 'sharp' = 'outlined';
const MATERIAL_SYMBOLS_CDN = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-${MATERIAL_SYMBOLS_WEIGHT}@${MATERIAL_SYMBOLS_VERSION}/${MATERIAL_SYMBOLS_STYLE}`;

const buildMaterialUrl = (name: string, variant: IconVariant) => {
  const suffix = variant === 'fill' ? '-fill' : '';
  return `${MATERIAL_SYMBOLS_CDN}/${name}${suffix}.svg`;
};

const isSvgMarkup = (input: string) => input.trim().startsWith('<svg');

/**
 * Fetch an SVG. Returns:
 * - the raw SVG markup on success
 * - `null` if the resource is not found / not a valid SVG (so callers can render nothing).
 */
const loadSVG = async (input: string): Promise<string | null> => {
  try {
    const response = await fetch(input);
    if (!response.ok) return null;
    const text = await response.text();
    if (!/<svg\b/i.test(text)) return null;
    return text;
  } catch {
    return null;
  }
};

// An explicit `fill="…"` / `stroke="…"` whose value is a paint we should replace:
// anything except `none` and `url(#…)` references (gradients / patterns).
const PAINT_ATTR = /(\s)(fill|stroke)="(?!\s*none\s*")(?!\s*url\()[^"]*"/gi;
const DEFS_BLOCK = /(<defs\b[\s\S]*?<\/defs>)/i;
const ROOT_TAG = /^(\s*(?:<\?xml[^>]*>\s*)?)<svg\b([^>]*)>/i;

/**
 * Make an SVG adopt the surrounding text color and scale to the Icon box.
 *
 * - Only fills/strokes that are explicitly set (and not `none`) become `currentColor`.
 *   Built-in icons are stroke-based with `fill="none"` on the root and no fill on their
 *   paths; painting unset fills would turn their outlines into solid blobs.
 * - Shapes inside `<defs>` (clip paths, masks) are left alone.
 * - If the root `<svg>` has no fill, it gets `fill="currentColor"` so shapes that inherit
 *   the default black fill (Material Symbols) follow the text color instead.
 * - The root's fixed `width`/`height` are replaced with `100%` so `viewBox` drives scaling.
 *
 * String-based (no DOMParser) so server and client produce identical markup.
 */
const recolorSvg = (markup: string): string => {
  const rootMatch = ROOT_TAG.exec(markup);
  if (!rootMatch) return markup;

  const [rootTag, prolog, rootAttrs] = rootMatch;
  let attrs = rootAttrs.replace(/\s(width|height)="[^"]*"/gi, '');
  attrs = attrs.replace(PAINT_ATTR, '$1$2="currentColor"');
  if (!/\sfill="/i.test(attrs)) attrs += ' fill="currentColor"';
  const newRoot = `${prolog}<svg width="100%" height="100%"${attrs}>`;

  const body = markup
    .slice(rootTag.length)
    .split(DEFS_BLOCK)
    .map((part) => (DEFS_BLOCK.test(part) ? part : part.replace(PAINT_ATTR, '$1$2="currentColor"')))
    .join('');

  return newRoot + body;
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
  // Markup available synchronously: inline `src` markup, or a built-in icon by name.
  const syncMarkup =
    src !== undefined ? (isSvgMarkup(src) ? src : undefined) : name ? getBuiltInIcon(name) : undefined;
  // Everything else has to be fetched (custom URL, or the Material Symbols fallback).
  const remoteSource = syncMarkup !== undefined ? '' : src ?? (name ? buildMaterialUrl(name, variant) : '');

  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!remoteSource) {
      setSvgContent(null);
      setLoadFailed(false);
      return;
    }
    let canceled = false;
    setLoadFailed(false);
    setSvgContent(null);
    loadSVG(remoteSource).then((result) => {
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
  }, [remoteSource]);

  const markup = syncMarkup ?? (remoteSource ? svgContent : null);
  const recolored = useMemo(() => (markup ? recolorSvg(markup) : null), [markup]);

  // No name / src — nothing to render.
  if (syncMarkup === undefined && !remoteSource) return null;
  // Icon could not be resolved (404 from Material CDN, unknown name, network error — etc.).
  if (syncMarkup === undefined && loadFailed) return null;

  const resolvedSize = typeof size === 'number' ? `${size}px` : size;
  const classes = ['icon', `icon--${variant}`, className].filter(Boolean).join(' ');
  const mergedStyle: React.CSSProperties = {
    width: resolvedSize,
    height: resolvedSize,
    color,
    ...style,
  };

  // Reserve layout space while a remote SVG is loading so the row doesn't shift when it arrives.
  if (!recolored) {
    return <div className={classes} style={mergedStyle} aria-hidden="true" {...props} />;
  }

  return (
    <div className={classes} style={mergedStyle} {...props}>
      <div
        className="icon__svg"
        dangerouslySetInnerHTML={{ __html: recolored }}
      />
    </div>
  );
};
