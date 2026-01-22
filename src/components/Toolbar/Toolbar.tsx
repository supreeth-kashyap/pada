import React from 'react';
import './Toolbar.css';

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '' }) => {
  return (
    <div className={`toolbar ${className}`.trim()}>
      {children}
    </div>
  );
};
