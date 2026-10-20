import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemeProvider, type ThemeSettings } from '../src/components/Theme';
import '../src/styles/tokens.generated.css';
import '../src/styles/base.css';
import './preview.css';

const ACCENTS = [
  'indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'lime', 'yellow', 'amber',
  'orange', 'red', 'rose', 'pink', 'fuchsia', 'purple', 'violet', 'slate', 'gray', 'zinc', 'neutral', 'stone',
];

// Every story renders inside a ThemeProvider driven by the toolbar globals, so each theme axis
// can be checked without writing per-story variants.
const withPadaTheme: Decorator = (Story, context) => {
  const { theme, accent, neutral, density, radius, contrast } = context.globals as ThemeSettings;
  return (
    <ThemeProvider
      target="root"
      theme={theme}
      accent={accent}
      neutral={neutral}
      density={density}
      radius={radius}
      contrast={contrast}
    >
      <Story />
    </ThemeProvider>
  );
};

// Generic so each icon keeps its literal type, which the toolbar addon checks against its icon names.
const toolbar = <Icon extends string>(title: string, icon: Icon, items: string[]) => ({
  description: title,
  toolbar: { title, icon, items, dynamicTitle: true },
});

const preview: Preview = {
  decorators: [withPadaTheme],
  globalTypes: {
    theme: toolbar('Theme', 'mirror', ['light', 'dark', 'system']),
    accent: toolbar('Accent', 'paintbrush', ACCENTS),
    neutral: toolbar('Neutral', 'contrast', ['stone', 'slate', 'gray', 'zinc', 'neutral']),
    density: toolbar('Density', 'component', ['compact', 'comfortable', 'spacious']),
    radius: toolbar('Radius', 'circlehollow', ['none', 'sm', 'md', 'lg', 'xl']),
    contrast: toolbar('Contrast', 'eye', ['standard', 'more']),
  },
  initialGlobals: {
    theme: 'light',
    accent: 'indigo',
    neutral: 'stone',
    density: 'comfortable',
    radius: 'md',
    contrast: 'standard',
  },
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // 'todo' reports violations in the a11y panel without failing the story.
      test: 'todo',
    },
    options: {
      storySort: { order: ['Introduction', 'Foundation', 'Components'] },
    },
  },
};

export default preview;
