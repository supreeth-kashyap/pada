import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from './portalContainer';
import { useIsClient } from './useIsClient';

export interface PortalProps {
  children?: ReactNode;
  /** Element to render into. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null;
}

/**
 * Renders children into `container`, else the nearest `PortalContainerContext`, else `document.body`, outside any `overflow: hidden` or
 * stacking context of the trigger. Renders nothing on the server.
 */
export function Portal({ children, container }: PortalProps) {
  const isClient = useIsClient();
  const contextContainer = usePortalContainer();
  if (!isClient) return null;
  return createPortal(children, container ?? contextContainer ?? document.body);
}
