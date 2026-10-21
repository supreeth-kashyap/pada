/// <reference types="vite/client" />

/**
 * Built-in icons shipped with the library (`src/assets/icons/*.svg`), inlined at build
 * time as raw markup and keyed by file basename (e.g. `tick_1`, `chevron_down`).
 *
 * The glob is eager so lookups are synchronous: an `<Icon name="tick_1" />` renders its
 * SVG on the very first render, without a network request, and during SSR.
 */
const modules = import.meta.glob<string>('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const registry: Record<string, string> = {};
for (const [path, markup] of Object.entries(modules)) {
  const basename = path.slice(path.lastIndexOf('/') + 1).replace(/\.svg$/, '');
  registry[basename] = markup;
}

/** Names of every built-in icon, sorted alphabetically. Pass any of these as `Icon`'s `name`. */
export const iconNames: readonly string[] = Object.freeze(Object.keys(registry).sort());

/** Raw SVG markup for a built-in icon, or `undefined` if `name` isn't bundled. */
export const getBuiltInIcon = (name: string): string | undefined =>
  Object.prototype.hasOwnProperty.call(registry, name) ? registry[name] : undefined;
