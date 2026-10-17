import type { ReactElement, ReactNode } from 'react';
import {
  HoverCardArrow as HeadlessArrow,
  HoverCardContent as HeadlessContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
  type HoverCardArrowProps,
  type HoverCardContentProps as HeadlessContentProps,
  type HoverCardRootProps,
} from '../../headless/HoverCard/HoverCard';
import './HoverCard.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface HoverCardContentProps extends HeadlessContentProps {
  /** Element to portal into. Defaults to the nearest portal container, else `document.body`. */
  container?: Element | null;
}

/** The card, in a portal, animated from the side that faces the trigger. */
function HoverCardContent({ container, className, ...props }: HoverCardContentProps) {
  return (
    <HoverCardPortal container={container}>
      <HeadlessContent {...props} className={cx('hover-card', className)} />
    </HoverCardPortal>
  );
}

/** Arrow pointing at the trigger. */
function HoverCardArrow({ className, ...props }: HoverCardArrowProps) {
  return <HeadlessArrow {...props} className={cx('hover-card-arrow', className)} />;
}

export interface HoverCardProps extends Omit<HoverCardRootProps, 'children'> {
  /** The trigger: a link or a name. It receives the hover and focus handlers. */
  children: ReactElement;
  /** The card's content. */
  content: ReactNode;
  side?: HeadlessContentProps['side'];
  align?: HeadlessContentProps['align'];
  /** Show an arrow pointing at the trigger. */
  arrow?: boolean;
  className?: string;
}

/**
 * A rich preview shown when people hover or focus a link: a profile, a page, a repository.
 * Opens after a short delay and stays open while the pointer is over the card.
 *
 * The card is supplementary: what it shows must also be reachable through the link itself.
 * Compose `HoverCard.Root`, `HoverCard.Trigger`, `HoverCard.Content` and `HoverCard.Arrow` for
 * full control.
 */
export function HoverCard({ children, content, side, align, arrow, className, ...props }: HoverCardProps) {
  return (
    <HoverCardRoot {...props}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side={side} align={align} className={className}>
        {content}
        {arrow && <HoverCardArrow />}
      </HoverCardContent>
    </HoverCardRoot>
  );
}

HoverCard.Root = HoverCardRoot;
HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;
HoverCard.Arrow = HoverCardArrow;
