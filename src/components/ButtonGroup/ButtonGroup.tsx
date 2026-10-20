import { useMemo, type ComponentPropsWithRef } from 'react';
import { ButtonGroupContext } from '../Button/ButtonGroupContext';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import './ButtonGroup.css';

export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
  /** Accessible name of the group, e.g. "Text alignment". */
  label?: string;
  /** Size for the buttons that set none. */
  size?: ButtonSize;
  /** Variant for the buttons that set none. */
  variant?: ButtonVariant;
  /** Lays the buttons out in a row or a column. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Joins the buttons into one segmented control: shared borders, outer corners only. */
  attached?: boolean;
}

/**
 * A row (or column) of related buttons, `role="group"` and named by `label`. Buttons without
 * their own `size` / `variant` take the group's.
 *
 * ```tsx
 * <ButtonGroup label="Text alignment" variant="secondary" size="sm" attached>
 *   <Button leftIcon="align_left">Left</Button>
 *   <Button leftIcon="align_center">Center</Button>
 *   <Button leftIcon="align_right">Right</Button>
 * </ButtonGroup>
 * ```
 *
 * Every button keeps its own tab stop: a group of actions is not a toolbar. For one tab stop and
 * arrow keys, or pressed states, use `ToggleGroup`.
 */
export function ButtonGroup({
  label,
  size,
  variant,
  orientation = 'horizontal',
  attached = false,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  const context = useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        role="group"
        aria-label={label}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        data-orientation={orientation}
        data-attached={attached ? '' : undefined}
        {...props}
        className={['button-group', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}
