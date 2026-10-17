import type { ComponentPropsWithRef } from 'react';
import { Slot } from '../../headless/utils/Slot';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import './Link.css';

export interface LinkProps extends ComponentPropsWithRef<'a'> {
  /** `accent` (default) or `neutral` (inherits the surrounding text colour). */
  tone?: 'accent' | 'neutral';
  /** `hover` underlines on hover only; `always` keeps the underline. */
  underline?: 'hover' | 'always';
  /** Opens in a new tab with `rel="noopener noreferrer"`, an icon and a screen-reader hint. */
  external?: boolean;
  /** Style your router's link component instead of rendering an `<a>`. */
  asChild?: boolean;
}

/** A text link. Use `asChild` with a router link: `<Link asChild><RouterLink to="/" /></Link>`. */
export function Link({ tone = 'accent', underline = 'hover', external, asChild, className, children, ...props }: LinkProps) {
  const Component = asChild ? Slot : 'a';
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Component data-tone={tone} data-underline={underline} {...externalProps} {...props} className={['link', className].filter(Boolean).join(' ')}>
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {external && (
            <>
              {/* Inline SVG (not Icon, which renders a <div>) so links stay valid inside paragraphs. */}
              <svg className="link-external-icon" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
            </>
          )}
        </>
      )}
    </Component>
  );
}
