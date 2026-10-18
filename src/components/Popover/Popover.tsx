import React, { useId } from 'react';
import {
  PopoverAnchor,
  PopoverArrow as HeadlessArrow,
  PopoverClose,
  PopoverContent as HeadlessContent,
  PopoverPortal as HeadlessPortal,
  PopoverRoot,
  PopoverTitle as HeadlessTitle,
  PopoverTrigger,
  type PopoverArrowProps,
  type PopoverCloseProps,
  type PopoverContentProps as HeadlessContentProps,
  type PopoverTitleProps,
} from '../../headless/Popover/Popover';
import { Icon } from '../Icon';
import './Popover.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type PopoverVariant = 'default' | 'active';
export type PopoverContentVariant = 'default' | 'dashed' | 'active';

export interface PopoverContentProps extends HeadlessContentProps {
  /** Surface style: default (solid border), dashed, or active (accent border with a glow). */
  variant?: PopoverContentVariant;
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
}

/** The floating panel, rendered in a portal and animated from the side that faces its trigger. */
function PopoverContent({ variant = 'default', container, sideOffset = 8, className, ...props }: PopoverContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessContent data-variant={variant} sideOffset={sideOffset} {...props} className={cx('popover', className)} />
    </HeadlessPortal>
  );
}

/** The popover's heading; names the popover for assistive technology. */
function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return <HeadlessTitle {...props} className={cx('popover-title', className)} />;
}

/** Arrow pointing at the trigger. */
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return <HeadlessArrow {...props} className={cx('popover-arrow', className)} />;
}

export interface PopoverCloseButtonProps extends Omit<PopoverCloseProps, 'children' | 'asChild'> {
  /** Accessible name of the icon button. */
  label?: string;
}

/** Icon button in the top corner that closes the popover. */
function PopoverCloseButton({ label = 'Close', className, ...props }: PopoverCloseButtonProps) {
  return (
    <PopoverClose aria-label={label} {...props} className={cx('popover-close', className)}>
      <Icon name="cross_1" size={14} aria-hidden="true" />
    </PopoverClose>
  );
}

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Element that toggles the popover. It receives the trigger's ARIA attributes. */
  trigger?: React.ReactElement;
  /** Preferred side. `auto` prefers the bottom; every side flips when there is no room. */
  position?: PopoverPosition;
  title?: string;
  variant?: PopoverVariant;
  showClose?: boolean;
  className?: string;
  /** Viewport coordinates to anchor the popover at instead of the trigger (a context menu, say). */
  clickPosition?: { x: number; y: number };
}

/**
 * A panel anchored to a trigger. Closes on Escape, on a click outside and when focus leaves it.
 *
 * Also a namespace of compound parts for full control:
 * `Popover.Root`, `Popover.Trigger`, `Popover.Anchor`, `Popover.Content`, `Popover.Title`,
 * `Popover.Arrow`, `Popover.Close`, `Popover.CloseButton`.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger asChild><Button variant="secondary">Filters</Button></Popover.Trigger>
 *   <Popover.Content side="bottom" align="start">
 *     <Popover.Title>Filters</Popover.Title>
 *     …
 *     <Popover.CloseButton />
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
export function Popover({
  open,
  onOpenChange,
  children,
  trigger,
  position = 'auto',
  title,
  variant = 'default',
  showClose = true,
  className,
  clickPosition,
}: PopoverProps) {
  const labelId = useId();
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange}>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      {clickPosition && (
        <PopoverAnchor asChild>
          <span aria-hidden="true" style={{ position: 'fixed', left: clickPosition.x, top: clickPosition.y, width: 0, height: 0 }} />
        </PopoverAnchor>
      )}
      <PopoverContent
        side={position === 'auto' ? 'bottom' : position}
        // 1.x look: the default variant had a dashed accent border.
        variant={variant === 'active' ? 'active' : 'dashed'}
        className={className}
        aria-label={title ? undefined : 'Popover'}
        aria-labelledby={title ? labelId : undefined}
      >
        {title && (
          <h3 id={labelId} className="popover-title">
            {title}
          </h3>
        )}
        <div className="popover-body">{children}</div>
        {variant === 'active' && (
          <span className="popover-badge" aria-hidden="true">
            <Icon name="star" size={16} />
          </span>
        )}
        {showClose && <PopoverCloseButton label="Close popover" />}
      </PopoverContent>
    </PopoverRoot>
  );
}

Popover.Root = PopoverRoot;
Popover.Trigger = PopoverTrigger;
Popover.Anchor = PopoverAnchor;
Popover.Content = PopoverContent;
Popover.Title = PopoverTitle;
Popover.Arrow = PopoverArrow;
Popover.Close = PopoverClose;
Popover.CloseButton = PopoverCloseButton;
