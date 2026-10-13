// The dark token set is written once in src/styles/global.css, under the system-preference
// query. This copies its declarations into a `[data-theme="dark"]` rule so an app can force
// dark mode on <html> or any container. `:root[data-theme="dark"]` outranks the light set's
// bare `:root` regardless of source order. Used by build-tokens-css.mjs for dist/tokens.css
// and by the Vite plugin in vite.config.ts for the demo, so both see the same CSS.
const SYSTEM_DARK_BLOCK =
  /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme\]\)\s*\{([^}]*)\}\s*\}/;

export function expandThemeCss(css) {
  const match = css.match(SYSTEM_DARK_BLOCK);
  if (!match) {
    throw new Error(
      'global.css: expected `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`',
    );
  }

  return `${css.trimEnd()}\n\n/* Forced dark theme (generated from the system-preference block above) */\n:root[data-theme="dark"],\n[data-theme="dark"] {${match[1]}}\n`;
}
