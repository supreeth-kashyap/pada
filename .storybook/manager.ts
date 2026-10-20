import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// The Pada lockup heads the sidebar; the image is served from public/.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Pada Design System',
    brandUrl: 'https://github.com/supreeth-kashyap/pada',
    brandImage: './pada-logo.svg',
    brandTarget: '_blank',
  }),
});
