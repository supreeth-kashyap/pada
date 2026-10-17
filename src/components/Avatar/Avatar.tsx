import React, { Children, isValidElement, useEffect, useState, type ComponentPropsWithRef } from 'react';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Image URL. Falls back to initials, then a person icon, while loading or on error. */
  src?: string;
  /** Person or entity name: the accessible name, and the source of the initials and colour. */
  name?: string;
  /** Alternative text for the image when it differs from `name`. */
  alt?: string;
  /** xs 20px, sm 24px, md 32px, lg 40px, xl 56px. */
  size?: AvatarSize;
  /** Circle for people, square for organisations and projects. */
  shape?: 'circle' | 'square';
  /** Presence dot in the corner. */
  status?: AvatarStatus;
}

const COLORS = ['indigo', 'violet', 'pink', 'orange', 'amber', 'emerald', 'teal', 'sky'] as const;

/** Up to two initials: first and last word. */
const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
};

/** A stable colour per name, so the same person always gets the same fallback colour. */
const colorOf = (name: string) => {
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
};

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

function useImageStatus(src: string | undefined): LoadStatus {
  const [status, setStatus] = useState<{ src?: string; status: LoadStatus }>({ src, status: src ? 'loading' : 'idle' });
  useEffect(() => {
    if (!src) return;
    let active = true;
    const image = new Image();
    image.onload = () => active && setStatus({ src, status: 'loaded' });
    image.onerror = () => active && setStatus({ src, status: 'error' });
    image.src = src;
    return () => {
      active = false;
    };
  }, [src]);
  if (!src) return 'idle';
  return status.src === src ? status.status : 'loading';
}

/**
 * A user or entity picture. Shows the image once it has loaded; until then (or if it fails)
 * shows initials on a colour derived from the name, or a person icon when there is no name.
 */
export function Avatar({ src, name, alt, size = 'md', shape = 'circle', status, className, ...props }: AvatarProps) {
  const imageStatus = useImageStatus(src);
  const label = alt ?? name;
  const initials = name ? initialsOf(name) : '';
  return (
    <span
      data-size={size}
      data-shape={shape}
      data-color={name ? colorOf(name) : undefined}
      role={imageStatus === 'loaded' ? undefined : 'img'}
      aria-label={imageStatus === 'loaded' ? undefined : label}
      {...props}
      className={['avatar', className].filter(Boolean).join(' ')}
    >
      {imageStatus === 'loaded' ? (
        <img className="avatar-image" src={src} alt={label ?? ''} />
      ) : initials ? (
        <span className="avatar-initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <svg className="avatar-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="4" fill="currentColor" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
        </svg>
      )}
      {status && <span className="avatar-status" data-status={status} aria-label={status} role="img" />}
    </span>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithRef<'div'> {
  /** Show at most this many avatars, then a "+N" counter. */
  max?: number;
  /** Size applied to every avatar in the group. */
  size?: AvatarSize;
  /** Accessible name of the group, e.g. "Project members". */
  label?: string;
}

/** Overlapping avatars with a "+N" overflow counter. */
export function AvatarGroup({ max, size = 'md', label, className, children, ...props }: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(isValidElement) as React.ReactElement<AvatarProps>[];
  const visible = max !== undefined ? avatars.slice(0, max) : avatars;
  const hidden = avatars.length - visible.length;
  return (
    <div role="group" aria-label={label} data-size={size} {...props} className={['avatar-group', className].filter(Boolean).join(' ')}>
      {visible.map((avatar) => React.cloneElement(avatar, { size }))}
      {hidden > 0 && (
        <span className="avatar" data-size={size} data-shape="circle" data-overflow="" role="img" aria-label={`${hidden} more`}>
          <span className="avatar-initials" aria-hidden="true">
            +{hidden}
          </span>
        </span>
      )}
    </div>
  );
}
