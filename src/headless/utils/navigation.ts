// Keyboard navigation over a list of items (WAI-ARIA APG listbox, menu, toolbar, tabs).
// Pure functions over item descriptors, so they work for DOM-backed lists and data arrays alike.

export interface NavigableItem {
  /** Text used for type-ahead. */
  label: string;
  disabled?: boolean;
}

export type NavigationKey = 'next' | 'previous' | 'first' | 'last';

const scan = (items: readonly NavigableItem[], start: number, step: 1 | -1): number => {
  for (let index = start; index >= 0 && index < items.length; index += step) {
    if (!items[index].disabled) return index;
  }
  return -1;
};

/**
 * Index the key moves to, skipping disabled items. With `loop`, next/previous wrap around;
 * without it they stop at the ends. From no current item (`from` = -1) next starts at the first
 * enabled item and previous at the last. Returns -1 only when every item is disabled.
 */
export function findNextIndex(
  items: readonly NavigableItem[],
  from: number,
  key: NavigationKey,
  { loop = false }: { loop?: boolean } = {},
): number {
  switch (key) {
    case 'first':
      return scan(items, 0, 1);
    case 'last':
      return scan(items, items.length - 1, -1);
    case 'next': {
      if (from < 0) return scan(items, 0, 1);
      const next = scan(items, from + 1, 1);
      if (next !== -1) return next;
      return loop ? scan(items, 0, 1) : from;
    }
    case 'previous': {
      if (from < 0) return scan(items, items.length - 1, -1);
      const previous = scan(items, from - 1, -1);
      if (previous !== -1) return previous;
      return loop ? scan(items, items.length - 1, -1) : from;
    }
  }
}

/**
 * Type-ahead: the next enabled item after `from` whose label starts with `search`, wrapping
 * around. A search of one repeated character ("aaa") cycles through items starting with it.
 * Returns `from` when nothing matches.
 */
export function findTypeaheadIndex(items: readonly NavigableItem[], from: number, search: string): number {
  const repeated = search.length > 1 && [...search].every((character) => character === search[0]);
  const needle = (repeated ? search[0] : search).toLowerCase();
  const startOffset = repeated || search.length === 1 ? 1 : 0;
  for (let offset = startOffset; offset < items.length + startOffset; offset += 1) {
    const index = (((from + offset) % items.length) + items.length) % items.length;
    const item = items[index];
    if (!item.disabled && item.label.trim().toLowerCase().startsWith(needle)) return index;
  }
  return from;
}

/** Maps an arrow/Home/End key to a navigation step for the given orientation (and direction). */
export function keyToNavigation(
  key: string,
  orientation: 'horizontal' | 'vertical' | 'both',
  dir: 'ltr' | 'rtl' = 'ltr',
): NavigationKey | null {
  if (key === 'Home' || key === 'PageUp') return 'first';
  if (key === 'End' || key === 'PageDown') return 'last';
  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';
  if (vertical && key === 'ArrowDown') return 'next';
  if (vertical && key === 'ArrowUp') return 'previous';
  if (horizontal && key === 'ArrowRight') return dir === 'rtl' ? 'previous' : 'next';
  if (horizontal && key === 'ArrowLeft') return dir === 'rtl' ? 'next' : 'previous';
  return null;
}
