/**
 * Public surface of the demo router. Everything the demo `App` needs to render the
 * sidebar + routes lives behind this barrel — adding/removing routes shouldn't require
 * any change in `App.tsx`.
 */
export { DemoRoutes } from './routes';
export { sidebarData, DEFAULT_PATH, NAV_ENTRIES, pathFor } from './nav';
export type { NavEntry, NavKind } from './nav';
