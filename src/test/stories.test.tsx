import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories, setProjectAnnotations } from '@storybook/react-vite';
import type { Meta, StoryFn } from '@storybook/react-vite';
import * as previewAnnotations from '../../.storybook/preview';

// Every story must render without throwing, under the same ThemeProvider decorator Storybook uses.
setProjectAnnotations(previewAnnotations);

type StoryModule = { default: Meta } & Record<string, StoryFn>;
const modules = import.meta.glob<StoryModule>('../**/*.stories.tsx', { eager: true });

describe.each(Object.entries(modules))('%s', (_path, module) => {
  const stories = Object.entries(composeStories(module));
  it.each(stories)('%s renders', async (_name, Story) => {
    const { container, unmount } = render(<Story />);
    expect(container).toBeTruthy();
    unmount();
  });
});
