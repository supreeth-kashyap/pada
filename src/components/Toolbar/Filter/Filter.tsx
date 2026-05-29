import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Filter.css';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { ComboBox, type ComboBoxItem } from '../../ComboBox';

export interface FilterOption {
  value: string;
  label: string;
  iconName?: string;
  disabled?: boolean;
}

export interface FilterProps {
  /** Label shown on the chip (e.g. "Status"). */
  label: string;
  /** Options the user can pick from. */
  options: FilterOption[];
  /**
   * When true, the popover shows ticks for every option and keeps itself open
   * until the user clicks Apply / Clear. When false, picking an option fires
   * `onChange` and closes the popover immediately.
   */
  multiSelect?: boolean;
  /** Controlled selection. Always an array \u2014 use `[value]` for single-select. */
  value?: string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string[];
  /**
   * Fired whenever the selection commits:
   *  - single-select: on every click
   *  - multi-select: on Apply / Clear only
   * Receives the new array of selected values plus the matching `FilterOption[]`.
   */
  onChange?: (values: string[], options: FilterOption[]) => void;
  /** Override the Apply button label. Defaults to "Apply". */
  applyLabel?: string;
  /** Override the Clear button label. Defaults to "Clear". */
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Filter \u2014 a toolbar chip backed by a popover-driven ComboBox.
 *
 * Single-select: clicking an option commits immediately and closes the popover.
 * Multi-select : the popover stages selections in a local draft, then commits
 *                on Apply (or discards on outside-click).
 *
 * The chip shows a count badge whenever there is at least one selection.
 */
export const Filter: React.FC<FilterProps> = ({
  label,
  options,
  multiSelect = false,
  value,
  defaultValue = [],
  onChange,
  applyLabel = 'Apply',
  clearLabel = 'Clear',
  disabled = false,
  className = ''
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const committed = isControlled ? (value as string[]) : internalValue;

  // Draft selection used while the popover is open in multi-select mode.
  // Initialised from `committed` whenever the popover opens.
  const [draft, setDraft] = useState<string[]>(committed);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Re-sync draft when the popover opens or the committed value changes externally.
  useEffect(() => {
    if (isOpen) setDraft(committed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Click-outside closes the popover. Multi-select drafts are discarded.
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

  const selectionCount = committed.length;
  const isActive = selectionCount > 0;

  const commit = (next: string[]) => {
    if (!isControlled) setInternalValue(next);
    const picked = options.filter((option) => next.includes(option.value));
    onChange?.(next, picked);
  };

  const handleItemClick = (item: ComboBoxItem) => {
    if (multiSelect) {
      setDraft((prev) =>
        prev.includes(item.id) ? prev.filter((v) => v !== item.id) : [...prev, item.id]
      );
    } else {
      // Single-select \u2014 commit immediately and close.
      commit([item.id]);
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    commit(draft);
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraft([]);
    if (!multiSelect) {
      commit([]);
      setIsOpen(false);
    }
  };

  const items: ComboBoxItem[] = useMemo(
    () =>
      options.map((option) => {
        const active = multiSelect ? draft : committed;
        return {
          id: option.value,
          label: option.label,
          iconName: option.iconName,
          disabled: option.disabled,
          selected: active.includes(option.value),
        };
      }),
    [options, multiSelect, draft, committed]
  );

  return (
    <div
      ref={rootRef}
      className={`toolbar-filter ${className}`.trim()}
    >
      <button
        type="button"
        className="toolbar-filter__chip"
        data-active={isActive ? '' : undefined}
        data-open={isOpen ? '' : undefined}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="toolbar-filter__label">{label}</span>
        {isActive ? (
          <span className="toolbar-filter__badge" aria-label={`${selectionCount} selected`}>
            {selectionCount}
          </span>
        ) : (
          <span className="toolbar-filter__dash" aria-hidden="true">
            <Icon name="remove" size={12} />
          </span>
        )}
        <Icon name="keyboard_arrow_down" size={12} className="toolbar-filter__chevron" />
      </button>

      {isOpen && (
        <div className="toolbar-filter__popover" role="dialog" aria-label={label}>
          <ComboBox
            items={items}
            multiSelect={multiSelect}
            onItemClick={handleItemClick}
            className="toolbar-filter__list"
          />
          {multiSelect && (
            <div className="toolbar-filter__footer">
              <Button variant="ghost" onClick={handleClear}>
                {clearLabel}
              </Button>
              <Button variant="primary" onClick={handleApply}>
                {applyLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
