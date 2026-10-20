import { Splitter } from '../Button/Splitter/Splitter';
import { SplitButtonRoot } from './SplitButton';

export type { SplitButtonRootProps } from './SplitButton';
export type { SplitterProps as SplitButtonSplitterProps } from '../Button/Splitter/Splitter';

/**
 * A main action joined to a chevron button that offers related ones. The two halves are separate
 * buttons with their own names and handlers; the splitter is usually a menu trigger.
 *
 * ```tsx
 * <SplitButton.Root variant="primary" label="Save options">
 *   <Button onClick={save}>Save</Button>
 *   <DropdownMenu.Root>
 *     <DropdownMenu.Trigger asChild><SplitButton.Splitter /></DropdownMenu.Trigger>
 *     <DropdownMenu.Content align="end">…</DropdownMenu.Content>
 *   </DropdownMenu.Root>
 * </SplitButton.Root>
 * ```
 *
 * The main `Button` and the splitter take the root's variant and size. Replaces the 1.x
 * `<Button split onSplitClick>`, which now renders this.
 */
export const SplitButton = {
  Root: SplitButtonRoot,
  Splitter,
};
