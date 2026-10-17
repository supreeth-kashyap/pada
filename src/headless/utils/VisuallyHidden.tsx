import type { ComponentPropsWithRef } from 'react';
import { Slot } from './Slot';

export interface VisuallyHiddenProps extends ComponentPropsWithRef<'span'> {
  /** Hide your own element instead of rendering a `<span>`. */
  asChild?: boolean;
}

const HIDDEN_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

/** Content for screen readers only: an icon button's label, a dialog title the design hides. */
export function VisuallyHidden({ asChild, style, ...props }: VisuallyHiddenProps) {
  const Component = asChild ? Slot : 'span';
  return <Component {...props} style={{ ...HIDDEN_STYLE, ...style }} />;
}
