import React, { useEffect } from 'react';
import './SideDrawer.css';

export type SideDrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: SideDrawerSize;
  className?: string;
}

const sizeMap: Record<SideDrawerSize, number> = {
  sm: 496,
  md: 640,
  lg: 800,
  xl: 960
};

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onOpenChange,
  children,
  size = 'sm',
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="side-drawer-overlay" onClick={() => onOpenChange(false)}>
      <div
        className={`side-drawer side-drawer--${size} ${className}`.trim()}
        style={{ width: `${sizeMap[size]}px` }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
