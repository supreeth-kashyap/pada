import React from 'react';
import './FilterChip.css';
import { Icon } from '../../Icon';

export type FilterChipVariant = 'filled' | 'prompt' | 'button';

export interface FilterChipProps {
  variant?: FilterChipVariant;
  label?: string;
  value?: string;
  showClose?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  variant = 'filled',
  label = 'Field',
  value = 'Attribute',
  showClose = true,
  disabled = false,
  onRemove,
  onClick,
  className = ''
}) => {
  const isButton = variant === 'button';
  const isPrompt = variant === 'prompt';
  const isFilled = variant === 'filled';

  return (
    <button
      type="button"
      className={`filter-chip filter-chip--${variant} ${disabled ? 'filter-chip--disabled' : ''} ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {isFilled && showClose && (
        <span className="filter-chip__remove">
          <span className="filter-chip__remove-icon" onClick={disabled ? undefined : onRemove}>
            <Icon name="cross_1" size="xs" color="Icy" />
          </span>
          <span className="filter-chip__divider" />
        </span>
      )}

      <span className="filter-chip__content">
        {isButton ? (
          <span className="filter-chip__button-label">Filters</span>
        ) : (
          <>
            <span className="filter-chip__label">{label}</span>
            <span className="filter-chip__colon">:</span>
            <span className="filter-chip__value">{value}</span>
          </>
        )}
        <Icon name="chevron_down" size="xs" color="Blue" />
      </span>
    </button>
  );
};
