import React from 'react';
import {
  TooltipArrow as HeadlessArrow,
  TooltipContent as HeadlessContent,
  TooltipPortal as HeadlessPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  type TooltipArrowProps,
  type TooltipContentProps as HeadlessContentProps,
} from '../../headless/Tooltip/Tooltip';
import './Tooltip.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface TooltipContentProps extends HeadlessContentProps {
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
}

/** The tooltip bubble, rendered in a portal and animated from the side that faces its trigger. */
function TooltipContent({ container, sideOffset = 6, className, ...props }: TooltipContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessContent sideOffset={sideOffset} {...props} className={cx('tooltip', className)} />
    </HeadlessPortal>
  );
}

/** Arrow pointing at the trigger. */
function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  return <HeadlessArrow {...props} className={cx('tooltip-arrow', className)} />;
}

export interface TooltipProps {
  /** Text (or short content) shown in the tooltip. Never put interactive content here. */
  content: React.ReactNode;
  /** The element the tooltip describes. It must be focusable (a button, link or input). */
  children: React.ReactElement;
  /** Preferred side; flips when there is no room. */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Hover time before the tooltip opens, in ms. Keyboard focus opens it immediately. */
  delayDuration?: number;
}

/**
 * A short description of an element, shown on hover and keyboard focus. The trigger gets
 * `aria-describedby` while the tooltip is open.
 *
 * Also a namespace of compound parts: `Tooltip.Provider` (shared delays), `Tooltip.Root`,
 * `Tooltip.Trigger`, `Tooltip.Content`, `Tooltip.Arrow`.
 */
export function Tooltip({ content, children, position = 'top', delayDuration = 300 }: TooltipProps) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={position}>{content}</TooltipContent>
    </TooltipRoot>
  );
}

Tooltip.Provider = TooltipProvider;
Tooltip.Root = TooltipRoot;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;
