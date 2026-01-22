import React from 'react';
import './SidebarLogo.css';
import { Logo } from '../../Logo';

export interface SidebarLogoProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({
  name,
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`sidebar-logo ${className}`.trim()}>
      {name && <Logo name={name} size={size} />}
    </div>
  );
};
