import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import './InfoTooltip.css';

export interface InfoTooltipProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** What the tooltip describes; the trigger is named "More info about {label}". */
  label: string;
  /** The explanation shown in the tooltip. Never put interactive content here. */
  text: ReactNode;
  /** Preferred side; flips when there is no room. @default 'top' */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A small info icon that explains the thing next to it: a native button that opens a Tooltip on
 * hover and keyboard focus, and closes on Escape.
 *
 * ```tsx
 * <span>Seats <InfoTooltip label="Seats" text="Seats are billed monthly, per active member." /></span>
 * ```
 *
 * Differences from Angular's `ds-info-tooltip`: built on Tooltip, so it renders in a portal,
 * flips to stay on screen, and only references the tooltip from `aria-describedby` while open.
 */
export function InfoTooltip({ label, text, position = 'top', className, type = 'button', ...props }: InfoTooltipProps) {
  return (
    <Tooltip content={text} position={position}>
      <button
        type={type}
        aria-label={`More info about ${label}`}
        {...props}
        className={['info-tooltip', className].filter(Boolean).join(' ')}
      >
        <Icon name="info" size={12} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
