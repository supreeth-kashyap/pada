import React from 'react';
import './Input.css';

interface InputProps {
  placeholder: string;
}

export const Input = ({ placeholder }: InputProps) => {
  return <input className="input" placeholder={placeholder} />;
};
