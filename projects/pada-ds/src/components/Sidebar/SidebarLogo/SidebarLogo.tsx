import React from 'react';
import './SidebarLogo.css';
import { BrandLogo, type LogoSize } from '../../Logo';
import { PadaLogo } from '../../PadaLogo';

export interface SidebarLogoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Image source (png / svg / data URL) shown as the logo mark. Takes precedence over `name`. */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Look up a built-in logo by name from the design system asset library */
  name?: string;
  /** Size of the built-in Logo component when `name` is used */
  size?: LogoSize;
  /** Optional wordmark / title rendered next to the logo */
  title?: React.ReactNode;
  /** Render as a clickable link when provided */
  href?: string;
  /** Click handler (applies to wrapper if no href) */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

export const SidebarLogo = React.forwardRef<HTMLDivElement, SidebarLogoProps>(
  (
    {
      src,
      alt = '',
      name,
      size = 'md',
      title,
      href,
      onClick,
      className = '',
      ...rest
    },
    ref
  ) => {
    const usingDefaults = !src && !name;
    const classes = [
      'sidebar-logo',
      usingDefaults && 'sidebar-logo--default',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const mark = src ? (
      <img src={src} alt={alt} className="sidebar-logo__mark" />
    ) : name ? (
      <BrandLogo name={name} size={size} className="sidebar-logo__mark sidebar-logo__mark--ds" />
    ) : title !== undefined ? (
      <PadaLogo variant="mark" size={32} decorative={!!title} className="sidebar-logo__mark" />
    ) : (
      <PadaLogo variant="lockup" size={28} title={alt || 'Pada'} className="sidebar-logo__lockup" />
    );

    const titleNode = title !== undefined ? <span className="sidebar-logo__title">{title}</span> : null;

    const content = (
      <>
        {mark}
        {titleNode}
      </>
    );

    if (href) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <a
            href={href}
            onClick={onClick}
            className="sidebar-logo__link"
            aria-label={typeof title === 'string' ? title : alt || undefined}
          >
            {content}
          </a>
        </div>
      );
    }

    return (
      <div ref={ref} className={classes} onClick={onClick} {...rest}>
        {content}
      </div>
    );
  }
);

SidebarLogo.displayName = 'SidebarLogo';
