import Prism from 'prismjs';

// Prism's language files are scripts that extend a global `Prism`. Bundlers that load CommonJS
// lazily (Rolldown, used by Vite 8) can run them before the core module has set that global, so
// set it here, in a module that is fully evaluated before `prismLanguages.ts` imports them.
(globalThis as typeof globalThis & { Prism?: typeof Prism }).Prism = Prism;

export default Prism;
