import type { ComponentPropsWithRef, ElementType } from 'react';
import './Container.css';

export interface ContainerProps extends ComponentPropsWithRef<'div'> {
  /** Maximum width, from the breakpoint tokens; `full` has none. @default 'xl' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Element to render, e.g. `main` or `section`. */
  as?: ElementType;
}

/** Centres page content at a readable maximum width, with side gutters that grow on wider screens. */
export function Container({ size = 'xl', as: Component = 'div', className, ...props }: ContainerProps) {
  return <Component {...props} data-size={size} className={['container', className].filter(Boolean).join(' ')} />;
}
