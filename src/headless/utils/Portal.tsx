import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useIsClient } from './useIsClient';

export interface PortalProps {
  children?: ReactNode;
  /** Element to render into. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null;
}

/**
 * Renders children into `document.body` (or `container`), outside any `overflow: hidden` or
 * stacking context of the trigger. Renders nothing on the server.
 */
export function Portal({ children, container }: PortalProps) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, container ?? document.body);
}
