import {
  PopoverRoot,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
} from './Popover';

export * from './Popover';

/**
 * Headless popover parts: a non-modal dialog anchored to a trigger.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Filters</Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content aria-label="Filters" side="bottom" align="start">
 *       …
 *       <Popover.Arrow />
 *     </Popover.Content>
 *   </Popover.Portal>
 * </Popover.Root>
 * ```
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
};
