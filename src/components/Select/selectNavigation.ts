// Keyboard navigation for the select-only combobox (WAI-ARIA APG). Pure functions over the
// option list so Select.tsx stays declarative and the behaviour is testable without a DOM.

export interface NavigableOption {
  label: string;
  disabled?: boolean;
}

export type SelectNavigationKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

const scan = (options: readonly NavigableOption[], start: number, step: 1 | -1): number => {
  for (let index = start; index >= 0 && index < options.length; index += step) {
    if (!options[index].disabled) return index;
  }
  return -1;
};

/**
 * Index of the option that `key` moves the active descendant to, skipping disabled options.
 * Arrow keys stop at the ends instead of wrapping; with no active option (`from` = -1),
 * ArrowDown starts at the first enabled option and ArrowUp at the last.
 * Returns -1 only when every option is disabled.
 */
export const findEnabledIndex = (
  options: readonly NavigableOption[],
  from: number,
  key: SelectNavigationKey,
): number => {
  switch (key) {
    case 'Home':
      return scan(options, 0, 1);
    case 'End':
      return scan(options, options.length - 1, -1);
    case 'ArrowDown': {
      if (from < 0) return scan(options, 0, 1);
      const next = scan(options, from + 1, 1);
      return next === -1 ? from : next;
    }
    case 'ArrowUp': {
      if (from < 0) return scan(options, options.length - 1, -1);
      const previous = scan(options, from - 1, -1);
      return previous === -1 ? from : previous;
    }
  }
};

/**
 * Type-ahead: the next enabled option after `from` whose label starts with `character`,
 * wrapping around the list. Returns `from` when nothing matches.
 */
export const findTypeaheadIndex = (
  options: readonly NavigableOption[],
  from: number,
  character: string,
): number => {
  const needle = character.toLowerCase();
  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (from + offset + options.length) % options.length;
    const option = options[index];
    if (!option.disabled && option.label.toLowerCase().startsWith(needle)) return index;
  }
  return from;
};
