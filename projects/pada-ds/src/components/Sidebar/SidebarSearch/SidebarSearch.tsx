import React from 'react';
import './SidebarSearch.css';

export interface SidebarSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`sidebar-search ${className}`.trim()}>
      <input
        type="text"
        className="sidebar-search__input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
