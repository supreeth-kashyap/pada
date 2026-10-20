import { createContext, useContext } from 'react';
import type { ButtonSize, ButtonVariant } from './Button';

/**
 * What a `ButtonGroup` or `SplitButton.Root` hands down to the buttons inside it. A button's own
 * `size` / `variant` prop wins; the group's value fills in when the button sets none.
 */
export interface ButtonGroupContextValue {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export const useButtonGroup = () => useContext(ButtonGroupContext);
