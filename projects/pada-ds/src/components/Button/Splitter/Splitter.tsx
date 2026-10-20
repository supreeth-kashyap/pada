import type { ComponentPropsWithRef } from 'react';
import '../Button.css';
import './Splitter.css';
import { Icon } from '../../Icon';
import type { ButtonSize } from '../Button';
import { useButtonGroup } from '../ButtonGroupContext';

export interface SplitterProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis when used outside a `SplitButton.Root`. @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** Size when used outside a `SplitButton.Root`. @default 'md' */
  size?: ButtonSize;
  /** Accessible name. @default 'More options' */
  label?: string;
}

/**
 * The chevron half of a split button: a square button with a down chevron, named by `label`.
 * Takes its variant and size from the surrounding `SplitButton.Root`. Also exported as
 * `SplitButton.Splitter`.
 */
export function Splitter({ variant, size, label = 'More options', className, type = 'button', ...props }: SplitterProps) {
  const group = useButtonGroup();
  const resolvedVariant = variant ?? group?.variant ?? 'primary';
  const resolvedSize = size ?? group?.size ?? 'md';
  return (
    <button
      type={type}
      aria-label={label}
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      {...props}
      className={['button', `button--${resolvedVariant}`, 'button-splitter', className].filter(Boolean).join(' ')}
    >
      <Icon name="chevron_down" size={resolvedSize === 'lg' ? 16 : 12} className="button__icon" aria-hidden="true" />
    </button>
  );
}
