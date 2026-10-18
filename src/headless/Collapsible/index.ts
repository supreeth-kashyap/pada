import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from './Collapsible';

export * from './Collapsible';

/**
 * Headless disclosure: a button that shows and hides one region.
 *
 * ```tsx
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Show details</Collapsible.Trigger>
 *   <Collapsible.Content>…</Collapsible.Content>
 * </Collapsible.Root>
 * ```
 */
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};
