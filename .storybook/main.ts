import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // The demo app's `public/` (logos, images) is served alongside the stories.
  staticDirs: ['../public'],
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
