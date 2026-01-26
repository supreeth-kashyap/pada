import React from 'react';
import './BaseManageFilter.css';
import { Button } from '../../Button';
import { Icon } from '../../Icon';

export interface BaseManageFilterProps {
  saveCopy?: boolean;
  onSaveFilter?: () => void;
  onClear?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export const BaseManageFilter: React.FC<BaseManageFilterProps> = ({
  saveCopy = false,
  onSaveFilter,
  onClear,
  onMenuClick,
  className = ''
}) => {
  return (
    <div className={`base-manage-filter ${className}`.trim()}>
      <Button
        variant="secondary"
        onClick={onSaveFilter}
        rightIcon={saveCopy ? 'chevron_down' : undefined}
      >
        Save filter
      </Button>
      <Button variant="ghost" onClick={onClear}>
        Clear
      </Button>
      <button type="button" className="base-manage-filter__menu" onClick={onMenuClick} aria-label="More options">
        <Icon name="menu_vertical" size={12} color="var(--color-neutral-600)" />
      </button>
    </div>
  );
};
