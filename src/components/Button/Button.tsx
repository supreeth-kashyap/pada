import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
}

export const Button = ({ children }: ButtonProps) => {
  return <button className="button">{children}</button>;
};
