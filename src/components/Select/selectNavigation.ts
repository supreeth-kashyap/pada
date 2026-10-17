// Keyboard navigation for the select-only combobox (WAI-ARIA APG), expressed in Select's own key
// names over the shared headless list helpers.
import {
  findNextIndex,
  findTypeaheadIndex as findTypeaheadMatch,
  type NavigableItem,
  type NavigationKey,
} from '../../headless/utils/navigation';

export type NavigableOption = NavigableItem;

export type SelectNavigationKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

const STEP: Record<SelectNavigationKey, NavigationKey> = {
  ArrowDown: 'next',
  ArrowUp: 'previous',
  Home: 'first',
  End: 'last',
};

/**
 * Index of the option that `key` moves the active descendant to, skipping disabled options.
 * Arrow keys stop at the ends instead of wrapping; with no active option (`from` = -1),
 * ArrowDown starts at the first enabled option and ArrowUp at the last.
 * Returns -1 only when every option is disabled.
 */
export const findEnabledIndex = (options: readonly NavigableOption[], from: number, key: SelectNavigationKey): number =>
  findNextIndex(options, from, STEP[key]);

/**
 * Type-ahead: the next enabled option after `from` whose label starts with `search`, wrapping
 * around the list. Returns `from` when nothing matches.
 */
export const findTypeaheadIndex = (options: readonly NavigableOption[], from: number, search: string): number =>
  findTypeaheadMatch(options, from, search);
