import type { ComponentPropsWithRef } from 'react';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import './Spinner.css';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
  /** sm 12px, md 16px, lg 24px. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Text announced to screen readers (`role="status"`). Pass `null` when the spinner sits inside
   * something already marked busy, such as a loading button.
   */
  label?: string | null;
}

/** An indeterminate loading indicator. Rotates; under reduced motion it pulses slowly instead. */
export function Spinner({ size = 'md', label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <span role={label ? 'status' : undefined} data-size={size} {...props} className={['spinner', className].filter(Boolean).join(' ')}>
      <span className="spinner-ring" aria-hidden="true" />
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
}
