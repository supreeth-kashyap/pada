import React, { useMemo, useState } from 'react';
import './Filter.css';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { ComboBox, type ComboBoxItem } from '../../ComboBox';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../../../headless/Popover/Popover';
import { VisuallyHidden } from '../../../headless/utils/VisuallyHidden';

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
 *                on Apply (or discards on Escape or an outside click).
 *
 * The chip shows a count badge whenever there is at least one selection. In the popover the
 * arrow keys move between options and Escape closes it, returning focus to the chip.
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
  const [isOpen, setIsOpenState] = useState(false);

  // Opening starts the draft from the committed value; closing without Apply discards it.
  const setIsOpen = (open: boolean) => {
    if (open) setDraft(committed);
    setIsOpenState(open);
  };

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
    <div className={`toolbar-filter ${className}`.trim()}>
      <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          className="toolbar-filter__chip"
          data-active={isActive ? '' : undefined}
          data-open={isOpen ? '' : undefined}
          disabled={disabled}
        >
          <span className="toolbar-filter__label">{label}</span>
          {isActive ? (
            <span className="toolbar-filter__badge">
              {selectionCount}
              <VisuallyHidden> selected</VisuallyHidden>
            </span>
          ) : (
            <span className="toolbar-filter__dash" aria-hidden="true">
              <Icon name="remove" size={12} />
            </span>
          )}
          <Icon name="chevron_down" size={12} className="toolbar-filter__chevron" />
        </PopoverTrigger>

        <PopoverPortal>
          <PopoverContent className="toolbar-filter__popover" aria-label={label} side="bottom" align="start" sideOffset={4}>
            <ComboBox
              items={items}
              multiSelect={multiSelect}
              onItemClick={handleItemClick}
              aria-label={label}
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
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </div>
  );
};
