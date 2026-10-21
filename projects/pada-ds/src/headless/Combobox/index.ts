import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
} from './Combobox';

export * from './Combobox';
export * from './filter';

/**
 * Headless combobox (WAI-ARIA APG Combobox with a listbox popup): typing filters, arrow keys
 * move the highlight, Enter selects, Escape closes and then clears. Single or multiple.
 *
 * ```tsx
 * <Combobox.Root>
 *   <Combobox.Anchor>
 *     <Combobox.Input aria-label="Fruit" />
 *     <Combobox.Trigger>▾</Combobox.Trigger>
 *   </Combobox.Anchor>
 *   <Combobox.Portal>
 *     <Combobox.Content>
 *       <Combobox.Item value="apple">Apple</Combobox.Item>
 *       <Combobox.Empty>No fruit found</Combobox.Empty>
 *     </Combobox.Content>
 *   </Combobox.Portal>
 * </Combobox.Root>
 * ```
 */
export const Combobox = {
  Root: ComboboxRoot,
  Anchor: ComboboxAnchor,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Portal: ComboboxPortal,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  Empty: ComboboxEmpty,
};
