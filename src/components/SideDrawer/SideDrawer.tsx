import React from 'react';
import { DialogRoot } from '../Dialog/Dialog';
import { DrawerContent } from '../Drawer/Drawer';

export type SideDrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: SideDrawerSize;
  className?: string;
  /** Accessible name of the drawer, when it has no visible heading to point at. */
  'aria-label'?: string;
  /** Id of the element that names the drawer (usually its heading). */
  'aria-labelledby'?: string;
}

/**
 * A panel that slides in from the right edge. Traps focus while open, closes on Escape or a
 * click on the backdrop, and returns focus to whatever opened it.
 *
 * @deprecated Since 2.0. Use `Drawer` (`Drawer.Root`, `Drawer.Content side="right"`, …), which
 * this wraps and which adds a trigger, title, other edges and padding. Removed in 3.0.
 */
export const SideDrawer: React.FC<SideDrawerProps> = ({ open, onOpenChange, children, size = 'sm', className, ...aria }) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <DrawerContent side="right" size={size} className={className} style={{ ['--pada-drawer-pad' as string]: 0, ['--pada-drawer-gap' as string]: 0 }} {...aria}>
      {children}
    </DrawerContent>
  </DialogRoot>
);
