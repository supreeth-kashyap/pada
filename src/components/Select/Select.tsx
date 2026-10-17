import React, { useState, useRef, useEffect, useId } from 'react';
import type { ComboBoxItem } from '../ComboBox/ComboBox';
import { ComboBox } from '../ComboBox/ComboBox';
import { Icon } from '../Icon';
import { findEnabledIndex, findTypeaheadIndex } from './selectNavigation';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  /** Controlled value. When provided, the parent owns selection state and MUST update it from `onChange` for the trigger to reflect the click. */
  value?: string | number;
  /** Uncontrolled initial value. Ignored when `value` is provided. */
  defaultValue?: string | number;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /**
   * Fired after the user picks an option from the dropdown. Receives the
   * newly selected `value` plus the full `SelectOption` (label / disabled /
   * etc.) so consumers don't have to look it up.
   */
  onChange?: (value: string | number, option: SelectOption) => void;
  description?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value: controlledValue,
  defaultValue,
  placeholder = 'Select an option',
  onChange,
  description,
  error,
  disabled = false,
  className,
  name,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // Index of the option the trigger points at through aria-activedescendant
  // (WAI-ARIA APG select-only combobox: focus never leaves the trigger).
  const [activeIndex, setActiveIndex] = useState(-1);

  // The label's htmlFor and the trigger's id must agree, so fall back to a
  // generated id when the consumer gives neither `id` nor `name`.
  const generatedId = useId();
  const triggerId = id || name || generatedId;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;

  // Support both controlled (`value`) and uncontrolled (`defaultValue`) usage.
  // Without internal state the trigger would never reflect a click unless the
  // parent rewired `value` from `onChange`, which silently broke consumers
  // that wanted a "fire and forget" dropdown.
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const selectedIndex = options.findIndex(opt => opt.value === currentValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const displayText = selectedOption?.label || placeholder;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isOpen]);

  const openList = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  // Opening starts on the selected option, or the first enabled one.
  const openOnSelection = () => {
    openList(
      selectedOption && !selectedOption.disabled
        ? selectedIndex
        : findEnabledIndex(options, -1, 'Home'),
    );
  };

  const commit = (option: SelectOption) => {
    if (option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value, option);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleItemClick = (item: ComboBoxItem) => {
    const option = options.find(opt => opt.value.toString() === item.id);
    if (!option) return;
    commit(option);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    const isTypeahead = key.length === 1 && key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey;

    if (!isOpen) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        openOnSelection();
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        openList(findEnabledIndex(options, -1, key));
      } else if (isTypeahead) {
        openList(findTypeaheadIndex(options, selectedIndex, key));
      }
      return;
    }

    switch (key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        event.preventDefault();
        setActiveIndex(findEnabledIndex(options, activeIndex, key));
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = options[activeIndex];
        if (option) commit(option);
        break;
      }
      case 'Escape':
        // Only close the listbox, not an enclosing Modal listening on document.
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        if (isTypeahead) {
          setActiveIndex(findTypeaheadIndex(options, activeIndex, key));
        }
    }
  };

  const comboBoxItems: ComboBoxItem[] = options.map((option, index) => ({
    id: option.value.toString(),
    label: option.label,
    selected: option.value === currentValue,
    disabled: option.disabled,
    active: index === activeIndex,
  }));

  return (
    <div className={['select-group', className].filter(Boolean).join(' ')}>
      <label className="select-label" id={labelId} htmlFor={triggerId}>
        {label}
      </label>
      <div
        className="select-container"
        ref={containerRef}
        data-error={error ? '' : undefined}
      >
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          className="select-trigger"
          onClick={() => (isOpen ? setIsOpen(false) : openOnSelection())}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={[description ? `${triggerId}-description` : '', error ? `${triggerId}-error` : ''].filter(Boolean).join(' ') || undefined}
          data-filled={selectedOption ? '' : undefined}
        >
          <span
            className="select-trigger-text"
            data-placeholder={selectedOption ? undefined : ''}
          >
            {displayText}
          </span>
          <Icon
            name="keyboard_arrow_down"
            size={12}
            className="select-icon"
            aria-hidden="true"
          />
        </button>
        {/* A button cannot carry a form value; this hidden input submits the selection. */}
        {name && <input type="hidden" name={name} value={currentValue ?? ''} disabled={disabled} />}
        {isOpen && (
          <div className="select-dropdown">
            <ComboBox
              id={listboxId}
              items={comboBoxItems}
              onItemClick={handleItemClick}
              role="listbox"
              aria-labelledby={labelId}
            />
          </div>
        )}
      </div>
      {description && <p id={`${triggerId}-description`} className="select-description">{description}</p>}
      {error && <p id={`${triggerId}-error`} className="select-error">{error}</p>}
    </div>
  );
};
