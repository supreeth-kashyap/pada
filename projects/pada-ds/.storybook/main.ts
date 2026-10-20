import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  // Docs pages (MDX) live in stories/docs, shared with the Angular Storybook; component stories
  // sit next to their components.
  stories: ['../stories/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // The repo-root `public/` (logos, favicon) is served alongside the stories.
  staticDirs: ['../../../public'],
  // Storybook composition: the published Angular Storybook appears in this sidebar, so one URL
  // shows both packages.
  refs: {
    angular: {
      title: 'Pada for Angular',
      url: 'https://main--6ad72a0038bb5d0de784c60f.chromatic.com',
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    // The root tsconfig.json only holds project references, so point docgen at the app config.
    reactDocgenTypescriptOptions: {
      tsconfigPath: './tsconfig.app.json',
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Keep inherited DOM attributes out of the props table; show only Pada's own props.
      propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
    },
  },
  // Reuses vite.config.ts; drop the library build settings, which only apply to `vite build`.
  viteFinal: async (viteConfig) => {
    if (viteConfig.build) delete viteConfig.build.lib;
    return viteConfig;
  },
};

export default config;
