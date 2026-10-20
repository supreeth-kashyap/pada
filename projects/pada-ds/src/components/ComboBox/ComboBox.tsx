import React, { useState } from 'react';
import './ComboBox.css';
import { ComboBoxMenuItem } from './ComboBoxMenuItem/ComboBoxMenuItem';
import { focusElement } from '../../headless/utils/focus';
import { findNextIndex, keyToNavigation } from '../../headless/utils/navigation';

export interface ComboBoxItem {
  id: string;
  label: React.ReactNode;
  iconName?: string;
  selected?: boolean;
  disabled?: boolean;
  /** The option an owning combobox currently points at with aria-activedescendant. */
  active?: boolean;
}

export interface ComboBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ComboBoxItem[];
  multiSelect?: boolean;
  onItemClick?: (item: ComboBoxItem, index: number) => void;
}

/**
 * A list of selectable options (`role="listbox"`).
 *
 * Without an `id` the listbox manages focus itself: it is one tab stop, and the arrow keys,
 * Home and End move between options. With an `id`, an owning combobox keeps focus and points at
 * options through `aria-activedescendant` (options are `${id}-option-${index}`).
 */
export const ComboBox: React.FC<ComboBoxProps> = ({
  items,
  multiSelect = false,
  onItemClick,
  className = '',
  id,
  onKeyDown,
  ...props
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const managesFocus = !id;
  // The tab stop: the option focused last, else the first selected, else the first enabled one.
  const enabled = (index: number) => index >= 0 && index < items.length && !items[index].disabled;
  const firstSelected = items.findIndex((item) => item.selected && !item.disabled);
  const tabStop = focusedIndex !== null && enabled(focusedIndex)
    ? focusedIndex
    : firstSelected !== -1
      ? firstSelected
      : items.findIndex((item) => !item.disabled);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !managesFocus) return;
    const step = keyToNavigation(event.key, 'vertical', 'ltr');
    if (!step) return;
    const options = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(':scope > [role="option"]'));
    const current = options.indexOf(event.target as HTMLElement);
    const next = findNextIndex(
      items.map((item) => ({ label: typeof item.label === 'string' ? item.label : '', disabled: item.disabled })),
      current,
      step,
    );
    if (next === -1) return;
    event.preventDefault();
    focusElement(options[next]);
  };

  return (
    <div
      className={`combo-box ${className}`.trim()}
      role="listbox"
      id={id}
      aria-multiselectable={multiSelect || undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {items.map((item, index) => (
        <ComboBoxMenuItem
          key={item.id}
          id={id ? `${id}-option-${index}` : undefined}
          tabIndex={managesFocus && index === tabStop ? 0 : -1}
          data-active={item.active ? '' : undefined}
          iconName={item.iconName}
          label={item.label}
          selected={item.selected}
          disabled={item.disabled}
          multiSelect={multiSelect}
          onFocus={managesFocus ? () => setFocusedIndex(index) : undefined}
          onClick={() => onItemClick?.(item, index)}
        />
      ))}
    </div>
  );
};
