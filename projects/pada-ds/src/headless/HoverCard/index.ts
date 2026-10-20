import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from './HoverCard';

export * from './HoverCard';

/**
 * Headless hover card: a rich preview of a link, shown on hover and keyboard focus.
 *
 * ```tsx
 * <HoverCard.Root>
 *   <HoverCard.Trigger href="/people/ada">@ada</HoverCard.Trigger>
 *   <HoverCard.Portal>
 *     <HoverCard.Content>…profile preview…</HoverCard.Content>
 *   </HoverCard.Portal>
 * </HoverCard.Root>
 * ```
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Portal: HoverCardPortal,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
};
