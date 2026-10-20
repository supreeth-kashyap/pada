import React from 'react';
import './Card.css';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`.trim()}>
      {children}
    </div>
  );
};
