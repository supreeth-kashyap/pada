import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
} from './Tooltip';

export * from './Tooltip';

/**
 * Headless tooltip parts. A tooltip describes its trigger; it must not contain interactive
 * content (use a Popover for that).
 *
 * ```tsx
 * <Tooltip.Provider>
 *   <Tooltip.Root>
 *     <Tooltip.Trigger aria-label="Delete">🗑</Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Content side="top">Delete permanently<Tooltip.Arrow /></Tooltip.Content>
 *     </Tooltip.Portal>
 *   </Tooltip.Root>
 * </Tooltip.Provider>
 * ```
 */
export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};
