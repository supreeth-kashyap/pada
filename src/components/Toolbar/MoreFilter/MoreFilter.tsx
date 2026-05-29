import React, { useEffect, useMemo, useRef, useState } from 'react';
import './MoreFilter.css';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { ComboBox, type ComboBoxItem } from '../../ComboBox';
import type { FilterOption } from '../Filter';

export interface MoreFilterDescriptor {
  /** Stable id used as the key in the values map. */
  id: string;
  /** Label shown in the left list of the tandem popover. */
  label: string;
  /** Options shown in the right list once this filter is focused. */
  options: FilterOption[];
  /** Defaults to true (multi-select). Single-select sub-filters commit instantly. */
  multiSelect?: boolean;
}

export type MoreFilterValues = Record<string, string[]>;

export interface MoreFilterProps {
  /** Chip label. Defaults to "More". */
  label?: string;
  /** Descriptors for every filter that lives behind the More popover. */
  filters: MoreFilterDescriptor[];
  /** Controlled value: a map of `filterId \u2192 selectedValues[]`. */
  value?: MoreFilterValues;
  /** Uncontrolled initial value. */
  defaultValue?: MoreFilterValues;
  /**
   * Fires when the user clicks Apply. Receives the full values map plus a
   * convenience `count` aggregate so consumers don't have to recompute it.
   */
  onChange?: (values: MoreFilterValues, count: number) => void;
  applyLabel?: string;
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
}

const countSelections = (values: MoreFilterValues): number =>
  Object.values(values).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);

/**
 * MoreFilter \u2014 a single chip that opens a tandem ComboBox popover:
 *   left column  = list of filter names
 *   right column = options for the focused filter
 *   footer       = Apply / Clear
 *
 * Useful when the toolbar can't fit every filter as a standalone chip.
 */
export const MoreFilter: React.FC<MoreFilterProps> = ({
  label = 'More',
  filters,
  value,
  defaultValue = {},
  onChange,
  applyLabel = 'Apply',
  clearLabel = 'Clear all',
  disabled = false,
  className = ''
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<MoreFilterValues>(defaultValue);
  const committed: MoreFilterValues = isControlled ? (value as MoreFilterValues) : internalValue;

  // Local draft so users can stage selections across multiple sub-filters
  // before applying them in one go.
  const [draft, setDraft] = useState<MoreFilterValues>(committed);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string>(filters[0]?.id ?? '');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(committed);
      // Re-anchor to the first filter (or keep the previous active if still present).
      if (!filters.some((f) => f.id === activeFilterId)) {
        setActiveFilterId(filters[0]?.id ?? '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  const totalCount = countSelections(committed);
  const isActive = totalCount > 0;

  const activeFilter = filters.find((f) => f.id === activeFilterId);
  const activeMulti = activeFilter?.multiSelect ?? true;

  const commit = (next: MoreFilterValues) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next, countSelections(next));
  };

  const handleOptionClick = (item: ComboBoxItem) => {
    if (!activeFilter) return;
    setDraft((prev) => {
      const current = prev[activeFilter.id] ?? [];
      if (activeMulti) {
        const next = current.includes(item.id)
          ? current.filter((v) => v !== item.id)
          : [...current, item.id];
        return { ...prev, [activeFilter.id]: next };
      }
      return { ...prev, [activeFilter.id]: [item.id] };
    });
  };

  const handleApply = () => {
    commit(draft);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setDraft({});
  };

  // Submenu items \u2014 options of the currently-focused filter, rendered as a
  // standard ComboBox to the right of the primary list.
  const optionItems: ComboBoxItem[] = useMemo(() => {
    if (!activeFilter) return [];
    const active = draft[activeFilter.id] ?? [];
    return activeFilter.options.map((option) => ({
      id: option.value,
      label: option.label,
      iconName: option.iconName,
      disabled: option.disabled,
      selected: active.includes(option.value),
    }));
  }, [activeFilter, draft]);

  return (
    <div ref={rootRef} className={`more-filter ${className}`.trim()}>
      <button
        type="button"
        className="more-filter__chip"
        data-active={isActive ? '' : undefined}
        data-open={isOpen ? '' : undefined}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="more-filter__label">{label}</span>
        {isActive ? (
          <span className="more-filter__badge" aria-label={`${totalCount} selected`}>
            {totalCount}
          </span>
        ) : (
          <span className="more-filter__dash" aria-hidden="true">
            <Icon name="remove" size={12} />
          </span>
        )}
        <Icon name="keyboard_arrow_down" size={12} className="more-filter__chevron" />
      </button>

      {isOpen && (
        <div className="more-filter__menu" role="dialog" aria-label={`${label} filters`}>
          {/* Primary list \u2014 each row is a filter that opens a cascading
              submenu of options to the right. Rendered with custom markup
              (rather than ComboBox) so we can place a chevron-right indicator
              on the right edge of every row. */}
          <div className="more-filter__primary" role="menu">
            {filters.map((f) => {
              const count = (draft[f.id] ?? []).length;
              const active = f.id === activeFilterId;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="menuitem"
                  className="more-filter__row"
                  data-active={active ? '' : undefined}
                  aria-haspopup="menu"
                  aria-expanded={active}
                  onClick={() => setActiveFilterId(f.id)}
                  onMouseEnter={() => setActiveFilterId(f.id)}
                >
                  <span className="more-filter__row-label">{f.label}</span>
                  {count > 0 && (
                    <span className="more-filter__row-count" aria-label={`${count} selected`}>
                      {count}
                    </span>
                  )}
                  <Icon
                    name="keyboard_arrow_right"
                    size={12}
                    className="more-filter__row-chevron"
                  />
                </button>
              );
            })}
          </div>

          {activeFilter && (
            <div className="more-filter__submenu" role="menu" aria-label={activeFilter.label}>
              <ComboBox
                items={optionItems}
                multiSelect={activeMulti}
                onItemClick={handleOptionClick}
                className="more-filter__submenu-list"
              />
              <div className="more-filter__footer">
                <Button variant="ghost" onClick={handleClearAll}>
                  {clearLabel}
                </Button>
                <Button variant="primary" onClick={handleApply}>
                  {applyLabel}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
