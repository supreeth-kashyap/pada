import { useMemo, type ComponentPropsWithRef } from 'react';
import { ButtonGroupContext } from '../Button/ButtonGroupContext';
import type { ButtonSize } from '../Button/Button';
import './SplitButton.css';

export interface SplitButtonRootProps extends ComponentPropsWithRef<'div'> {
  /** Visual emphasis of both halves. @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** Size of both halves. @default 'md' */
  size?: ButtonSize;
  /** Accessible name of the pair, e.g. "Save options". */
  label?: string;
}

/** A main action joined to a chevron button that offers related ones. */
export function SplitButtonRoot({ variant = 'primary', size, label, className, children, ...props }: SplitButtonRootProps) {
  const context = useMemo(() => ({ variant, size }), [variant, size]);
  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        role="group"
        aria-label={label}
        data-variant={variant}
        {...props}
        className={['split-button', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}
