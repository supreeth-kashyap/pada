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

/** A filter shown as a chip: its main button edits the filter, the cross removes it. */
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
  const isFilled = variant === 'filled';

  return (
    <span
      className={`filter-chip filter-chip--${variant} ${disabled ? 'filter-chip--disabled' : ''} ${className}`.trim()}
      data-disabled={disabled ? '' : undefined}
    >
      {isFilled && showClose && (
        <span className="filter-chip__remove">
          <button
            type="button"
            className="filter-chip__remove-icon"
            aria-label={`Remove filter ${label}: ${value}`}
            disabled={disabled}
            onClick={onRemove}
          >
            <Icon name="cross_1" size={12} color="var(--pada-color-neutral-600)" />
          </button>
          <span className="filter-chip__divider" />
        </span>
      )}

      <button type="button" className="filter-chip__content" disabled={disabled} onClick={onClick}>
        {isButton ? (
          <span className="filter-chip__button-label">Filters</span>
        ) : (
          <>
            <span className="filter-chip__label">{label}</span>
            <span className="filter-chip__colon">:</span>
            <span className="filter-chip__value">{value}</span>
          </>
        )}
        <Icon name="chevron_down" size={12} color="var(--pada-color-blue-600)" />
      </button>
    </span>
  );
};
