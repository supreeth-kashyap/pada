import { useId, useMemo, type ReactNode } from 'react';
import { useControllableState } from '../../headless/utils/useControllableState';
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  type ComboboxFilter,
} from '../../headless/Combobox';
import { Icon } from '../Icon';
import './Autocomplete.css';

export interface AutocompleteOption {
  value: string;
  label: string;
  /** Second line under the label. */
  description?: string;
  /** Built-in icon name. */
  icon?: string;
  disabled?: boolean;
}

interface AutocompleteBaseProps {
  label: string;
  options: AutocompleteOption[];
  placeholder?: string;
  /** Help text under the field. */
  description?: string;
  /** Error message; marks the field invalid. */
  error?: string;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  /** How options match the typed text; `false` for server-side search (filter the options yourself). */
  filter?: ComboboxFilter | false;
  /** Called on every keystroke, e.g. to fetch options. */
  onInputValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Name for form submission (a hidden input per selected value). */
  name?: string;
  className?: string;
}

export interface AutocompleteSingleProps extends AutocompleteBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface AutocompleteMultipleProps extends AutocompleteBaseProps {
  /** Pick several options, shown as removable chips. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AutocompleteProps = AutocompleteSingleProps | AutocompleteMultipleProps;

type LooseProps = AutocompleteBaseProps & {
  multiple?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
};

/**
 * A text field with filtered suggestions (combobox): type to narrow the list, arrows to move,
 * Enter to pick. With `multiple`, picks become chips; Backspace in the empty input removes the last.
 */
export function Autocomplete(props: AutocompleteProps) {
  const {
    label,
    options,
    placeholder,
    description,
    error,
    emptyMessage = 'No results',
    filter,
    onInputValueChange,
    disabled,
    required,
    name,
    className,
    multiple = false,
    value,
    defaultValue,
    onValueChange,
  } = props as LooseProps;
  const id = useId();
  const byValue = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
  const toList = (input: string | string[] | null | undefined) =>
    input === undefined ? undefined : input === null ? [] : Array.isArray(input) ? input : [input];
  // Selection is held here (not only in the headless root) because the chips and the hidden
  // form inputs render from it.
  const [values, setValues] = useControllableState<string[]>({
    prop: toList(value),
    defaultProp: toList(defaultValue) ?? [],
    onChange: (next) => onValueChange?.(multiple ? next : (next[0] ?? null)),
  });
  const inputId = `${id}input`;
  const describedBy = [description && `${id}description`, error && `${id}error`].filter(Boolean).join(' ') || undefined;
  const selectedLabel = !multiple && values[0] ? (byValue.get(values[0])?.label ?? '') : '';

  const rootProps = multiple
    ? ({ multiple: true, value: values, onValueChange: setValues } as const)
    : ({ value: values[0] ?? null, onValueChange: (next: string | null) => setValues(next === null ? [] : [next]) } as const);

  return (
    <div className={['autocomplete', className].filter(Boolean).join(' ')} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      <label className="autocomplete-label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="autocomplete-required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <ComboboxRoot {...rootProps} defaultInputValue={selectedLabel} filter={filter} onInputValueChange={onInputValueChange} disabled={disabled}>
        <ComboboxAnchor className="autocomplete-control">
          {multiple &&
            values.map((item) => (
              <span key={item} className="autocomplete-chip">
                {byValue.get(item)?.label ?? item}
                <button
                  type="button"
                  className="autocomplete-chip-remove"
                  aria-label={`Remove ${byValue.get(item)?.label ?? item}`}
                  disabled={disabled}
                  onClick={() => setValues(values.filter((entry) => entry !== item))}
                >
                  <Icon name="cross_1" size={10} aria-hidden="true" />
                </button>
              </span>
            ))}
          <ComboboxInput
            id={inputId}
            className="autocomplete-input"
            placeholder={multiple && values.length > 0 ? undefined : placeholder}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            required={required && values.length === 0}
            onKeyDown={(event) => {
              if (multiple && event.key === 'Backspace' && event.currentTarget.value === '' && values.length > 0) {
                setValues(values.slice(0, -1));
              }
            }}
          />
          <ComboboxTrigger className="autocomplete-trigger">
            <Icon name="chevron_down" size={12} aria-hidden="true" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxPortal>
          <ComboboxContent className="autocomplete-list" aria-label={label}>
            {options.map((option) => (
              <ComboboxItem key={option.value} value={option.value} textValue={option.label} disabled={option.disabled} className="autocomplete-option">
                {option.icon && <Icon name={option.icon} size={16} aria-hidden="true" className="autocomplete-option-icon" />}
                <span className="autocomplete-option-text">
                  <span className="autocomplete-option-label">{option.label}</span>
                  {option.description && <span className="autocomplete-option-description">{option.description}</span>}
                </span>
                <Icon name="tick_1" size={14} aria-hidden="true" className="autocomplete-option-check" />
              </ComboboxItem>
            ))}
            <ComboboxEmpty className="autocomplete-empty">{emptyMessage}</ComboboxEmpty>
          </ComboboxContent>
        </ComboboxPortal>
      </ComboboxRoot>
      {name && values.map((item) => <input key={item} type="hidden" name={name} value={item} />)}
      {description && (
        <p id={`${id}description`} className="autocomplete-description">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}error`} className="autocomplete-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
