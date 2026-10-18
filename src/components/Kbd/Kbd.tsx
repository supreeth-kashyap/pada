import type { ComponentPropsWithRef } from 'react';
import './Kbd.css';

export interface KbdProps extends ComponentPropsWithRef<'kbd'> {
  /** Several keys pressed together, e.g. `['⌘', 'K']`. Rendered as separate keys. */
  keys?: string[];
}

/** A keyboard key or shortcut, as in "Press ⌘ K". */
export function Kbd({ keys, className, children, ...props }: KbdProps) {
  const classes = ['kbd', className].filter(Boolean).join(' ');
  if (!keys) {
    return (
      <kbd {...props} className={classes}>
        {children}
      </kbd>
    );
  }
  return (
    <kbd {...props} className="kbd-group">
      {keys.map((key, index) => (
        <kbd key={`${key}-${index}`} className={classes}>
          {key}
        </kbd>
      ))}
    </kbd>
  );
}
