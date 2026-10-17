import { Fragment, useId } from 'react';
import { PinInputInput, PinInputRoot, type PinInputRootProps } from '../../headless/PinInput/PinInput';
import './PinInput.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface PinInputProps extends Omit<PinInputRootProps, 'children'> {
  label: string;
  description?: string;
  error?: string;
  /** Put a separator after every `groupSize` boxes (3 makes "123–456"). */
  groupSize?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A code or PIN field with one box per character. Typing moves to the next box, Backspace goes
 * back, and pasting (or a phone autofilling a code from a text message) fills every box.
 */
export function PinInput({ label, description, error, groupSize, size = 'md', className, length, ...props }: PinInputProps) {
  const id = useId();
  const describedBy = [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('pin-input-field', className)} data-invalid={error ? '' : undefined}>
      <span id={`${id}-label`} className="pin-input-label">
        {label}
      </span>
      <PinInputRoot {...props} length={length} className="pin-input" data-size={size} aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
        {Array.from({ length }, (_, index) => (
          <Fragment key={index}>
            {groupSize && index > 0 && index % groupSize === 0 && <span className="pin-input-separator" aria-hidden="true" />}
            <PinInputInput index={index} className="pin-input-box" aria-invalid={error ? true : undefined} />
          </Fragment>
        ))}
      </PinInputRoot>
      {description && (
        <p id={`${id}-description`} className="pin-input-description">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="pin-input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
