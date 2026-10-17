import { useCallback, useEffect, useRef } from 'react';

/**
 * Collects printable key presses into a search string that resets after a pause, the way
 * native lists behave. Returns a handler that yields the current search, or null for keys
 * that are not type-ahead (modifiers, Space at the start of a search, non-printable keys).
 */
export function useTypeahead(timeout = 700) {
  const search = useRef('');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return useCallback(
    (event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }): string | null => {
      const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
      if (!printable || (event.key === ' ' && search.current === '')) return null;
      search.current += event.key;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        search.current = '';
      }, timeout);
      return search.current;
    },
    [timeout],
  );
}
