import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import './Dropdown.css';

export type DropdownSelectionMode = 'single' | 'multi' | 'button';

interface DropdownContextValue {
  selectionMode: DropdownSelectionMode;
  selectedValues: string[];
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown sub-components must be used within Dropdown');
  }
  return context;
};

export interface DropdownProps {
  children: React.ReactNode;
  selectionMode?: DropdownSelectionMode;
  selectedValues?: string[];
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Dropdown = ({
  children,
  selectionMode = 'button',
  selectedValues = [],
  onSelect,
  onDeselect,
  open: controlledOpen,
  onOpenChange,
  className = '',
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (controlledOpen === undefined) {
          setInternalOpen(false);
        }
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, controlledOpen, onOpenChange]);

  const contextValue: DropdownContextValue = {
    selectionMode,
    selectedValues,
    onSelect,
    onDeselect,
    searchValue,
    setSearchValue,
  };

  // Process children to separate trigger and content
  const processedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childType = child.type as any;
    const isContent = childType?.displayName === 'DropdownContent' || childType?.name === 'DropdownContent';

    if (isContent) {
      // Only render content when open
      return isOpen ? child : null;
    }

    // For trigger elements (like Button), add onClick handler
    const childProps = child.props as { onClick?: (e: React.MouseEvent) => void };
    return React.cloneElement(child as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleToggle();
        if (childProps.onClick) {
          childProps.onClick(e);
        }
      },
    });
  });

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className={`dropdown ${className}`} ref={dropdownRef}>
        {processedChildren}
      </div>
    </DropdownContext.Provider>
  );
};
