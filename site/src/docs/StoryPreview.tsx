import { Component, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Skeleton } from 'pada-ds';

type StoryModule = Record<string, unknown>;

// Every React story, loaded on demand: a component page renders its first story live.
const stories = import.meta.glob<StoryModule>('../../../projects/pada-ds/src/**/*.stories.tsx');

class PreviewBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Renders the first story of `file` (relative to the library's src/) with its default args. */
export function StoryPreview({ file, fallback }: { file: string; fallback: ReactNode }) {
  const [Story, setStory] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = stories[`../../../projects/pada-ds/src/${file}`];
    if (!load) {
      setFailed(true);
      return;
    }
    Promise.all([load(), import('@storybook/react-vite')])
      .then(([mod, { composeStories }]) => {
        const composed = Object.values(composeStories(mod as Parameters<typeof composeStories>[0]));
        if (alive) setStory(() => (composed[0] as ComponentType | undefined) ?? null);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [file]);

  if (failed) return <>{fallback}</>;
  if (!Story) return <Skeleton shape="rect" height={180} />;
  return (
    <PreviewBoundary fallback={fallback}>
      <Story />
    </PreviewBoundary>
  );
}
