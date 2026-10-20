import { ToggleGroupItem, ToggleGroupRoot } from './Toggle';

export * from './Toggle';

/**
 * Headless toggle group: one tab stop, arrow keys between items, single or multiple pressed.
 *
 * ```tsx
 * <ToggleGroup.Root type="single" defaultValue="left" aria-label="Alignment">
 *   <ToggleGroup.Item value="left" aria-label="Left">⟸</ToggleGroup.Item>
 *   <ToggleGroup.Item value="center" aria-label="Center">≡</ToggleGroup.Item>
 * </ToggleGroup.Root>
 * ```
 */
export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
