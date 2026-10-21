import React, { useMemo, useState } from 'react';
import './MoreFilter.css';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { ComboBox, type ComboBoxItem } from '../../ComboBox';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../../../headless/Popover/Popover';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../../../headless/Tabs/Tabs';
import { VisuallyHidden } from '../../../headless/utils/VisuallyHidden';
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
 * Useful when the toolbar can't fit every filter as a standalone chip. The filter names are a
 * vertical tab list (Up/Down move between them), each showing its options as a listbox.
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
  const [isOpen, setIsOpenState] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string>(filters[0]?.id ?? '');

  // Opening starts the draft from the committed values (closing without Apply discards it) and
  // re-anchors to the first filter if the previously active one is gone.
  const setIsOpen = (open: boolean) => {
    if (open) {
      setDraft(committed);
      if (!filters.some((f) => f.id === activeFilterId)) setActiveFilterId(filters[0]?.id ?? '');
    }
    setIsOpenState(open);
  };

  const totalCount = countSelections(committed);
  const isActive = totalCount > 0;


  const commit = (next: MoreFilterValues) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next, countSelections(next));
  };

  const handleOptionClick = (activeFilter: MoreFilterDescriptor, item: ComboBoxItem) => {
    const activeMulti = activeFilter.multiSelect ?? true;
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

  // Submenu items \u2014 options of each filter, rendered as a standard ComboBox to the right of
  // the primary list.
  const optionItems = useMemo(
    () =>
      new Map(
        filters.map((filter): [string, ComboBoxItem[]] => {
          const selected = draft[filter.id] ?? [];
          return [
            filter.id,
            filter.options.map((option) => ({
              id: option.value,
              label: option.label,
              iconName: option.iconName,
              disabled: option.disabled,
              selected: selected.includes(option.value),
            })),
          ];
        }),
      ),
    [filters, draft],
  );

  return (
    <div className={`more-filter ${className}`.trim()}>
      <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          className="more-filter__chip"
          data-active={isActive ? '' : undefined}
          data-open={isOpen ? '' : undefined}
          disabled={disabled}
        >
          <span className="more-filter__label">{label}</span>
          {isActive ? (
            <span className="more-filter__badge">
              {totalCount}
              {' '}
              <VisuallyHidden>selected</VisuallyHidden>
            </span>
          ) : (
            <span className="more-filter__dash" aria-hidden="true">
              <Icon name="remove" size={12} />
            </span>
          )}
          <Icon name="chevron_down" size={12} className="more-filter__chevron" />
        </PopoverTrigger>

        <PopoverPortal>
          <PopoverContent
            className="more-filter__menu"
            aria-label={`${label} filters`}
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <TabsRoot
              value={activeFilterId}
              onValueChange={setActiveFilterId}
              orientation="vertical"
              className="more-filter__tabs"
            >
              {/* Primary list \u2014 each row is a filter whose options show to the right. */}
              <TabsList className="more-filter__primary" aria-label={`${label} filters`}>
                {filters.map((f) => {
                  const count = (draft[f.id] ?? []).length;
                  return (
                    <TabsTrigger
                      key={f.id}
                      value={f.id}
                      className="more-filter__row"
                      data-active={f.id === activeFilterId ? '' : undefined}
                      onMouseEnter={() => setActiveFilterId(f.id)}
                    >
                      <span className="more-filter__row-label">{f.label}</span>
                      {count > 0 && (
                        <span className="more-filter__row-count">
                          {count}
                          {' '}
                          <VisuallyHidden>selected</VisuallyHidden>
                        </span>
                      )}
                      <Icon name="chevron_right" size={12} className="more-filter__row-chevron" />
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="more-filter__submenu">
                {filters.map((f) => (
                  <TabsContent key={f.id} value={f.id} className="more-filter__panel" tabIndex={-1}>
                    <ComboBox
                      items={optionItems.get(f.id) ?? []}
                      multiSelect={f.multiSelect ?? true}
                      onItemClick={(item) => handleOptionClick(f, item)}
                      aria-label={f.label}
                      className="more-filter__submenu-list"
                    />
                  </TabsContent>
                ))}
                <div className="more-filter__footer">
                  <Button variant="ghost" onClick={handleClearAll}>
                    {clearLabel}
                  </Button>
                  <Button variant="primary" onClick={handleApply}>
                    {applyLabel}
                  </Button>
                </div>
              </div>
            </TabsRoot>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </div>
  );
};
