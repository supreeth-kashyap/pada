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
        size="sm"
        variant="secondary"
        onClick={onSaveFilter}
        rightIcon={saveCopy ? 'chevron_down' : undefined}
      >
        Save filter
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear}>
        Clear
      </Button>
      <button type="button" className="base-manage-filter__menu" onClick={onMenuClick} aria-label="More options">
        <Icon name="menu_vertical" size="xs" color="Icy" />
      </button>
    </div>
  );
};
