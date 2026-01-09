import React from 'react';
import { Icon } from '../Icon';
import { useDropdownContext } from './Dropdown';
import './Dropdown.css';

export interface DropdownSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  placeholder?: string;
}

export const DropdownSearch = ({
  placeholder = 'Search...',
  className = '',
  ...props
}: DropdownSearchProps) => {
  const context = useDropdownContext();
  const { searchValue, setSearchValue } = context;

  return (
    <div className="dropdown__search">
      <Icon name="search" size="xs" color="Icy" className="dropdown__search-icon" />
      <input
        type="text"
        className={`dropdown__search-input ${className}`.trim()}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        {...props}
      />
    </div>
  );
};
