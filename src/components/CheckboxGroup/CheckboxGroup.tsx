import { useId, useMemo, type ComponentPropsWithRef } from 'react';
import { useControllableState } from '../../headless/utils/useControllableState';
import { Checkbox } from '../Checkbox';
import './CheckboxGroup.css';

/** One choice in a `CheckboxGroup`. */
export interface CheckboxGroupOption {
  /** The value added to the group's array when checked. */
  value: string;
  /** Visible label. */
  label: string;
  /** Disables this choice only. */
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** The choices, in order. */
  options: readonly CheckboxGroupOption[];
  /** The checked values (controlled). */
  value?: string[];
  /** The initially checked values (uncontrolled). @default [] */
  defaultValue?: string[];
  /** Called with the checked values, in option order. */
  onValueChange?: (value: string[]) => void;
  /** Visible label; also the group's accessible name. Use `aria-label` without one. */
  label?: string;
  /** Help text under the label. */
  description?: string;
  /** Message shown (and announced) while the group is `invalid`. */
  error?: string;
  /** Marks the group invalid: shows `error` and sets `data-invalid`. */
  invalid?: boolean;
  /** Adds a "Select all" box before the choices. */
  selectAll?: boolean;
  /** Label of the select-all box. @default 'Select all' */
  selectAllLabel?: string;
  /** Stacks the choices (`vertical`) or lays them in a wrapping row. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Disables every choice. */
  disabled?: boolean;
  /** Marks the group required (at least one choice); shown next to the label. */
  required?: boolean;
  /** Name for native form submission: each checked choice submits as `name=value`. */
  name?: string;
}

/**
 * A labelled set of checkboxes whose value is the array of checked option values, with an
 * optional "Select all" box that turns mixed while only some are checked.
 *
 * ```tsx
 * <CheckboxGroup
 *   label="Notify me about"
 *   description="We send at most one email a day."
 *   options={topics}
 *   selectAll
 *   value={value}
 *   onValueChange={setValue}
 * />
 * ```
 *
 * `role="group"` named by the label and described by `description` and `error`; each choice is
 * a `Checkbox`, so Tab moves between them and Space toggles. Select all only changes the enabled
 * choices. Values are reported in option order, whatever order they were checked in.
 */
export function CheckboxGroup({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  label,
  description,
  error,
  invalid = false,
  selectAll = false,
  selectAllLabel = 'Select all',
  orientation = 'vertical',
  disabled = false,
  required = false,
  name,
  className,
  ...props
}: CheckboxGroupProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showError = Boolean(error && invalid);

  const items = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        checked: value.includes(option.value),
        disabled: disabled || !!option.disabled,
      })),
    [options, value, disabled],
  );
  const enabled = items.filter((item) => !item.disabled);
  const allChecked = enabled.length > 0 && enabled.every((item) => item.checked);
  const someChecked = !allChecked && enabled.some((item) => item.checked);

  const commit = (values: string[]) => {
    const order = options.map((option) => option.value);
    const rank = (entry: string) => {
      const index = order.indexOf(entry);
      return index === -1 ? Infinity : index;
    };
    setValue([...values].sort((a, b) => rank(a) - rank(b)));
  };

  const toggle = (entry: string, checked: boolean) => {
    const rest = value.filter((current) => current !== entry);
    commit(checked ? [...rest, entry] : rest);
  };

  const setAll = (checked: boolean) => {
    const enabledValues = new Set(enabled.map((item) => item.value));
    // Keep the disabled choices as they are.
    const kept = value.filter((entry) => !enabledValues.has(entry));
    commit(checked ? [...kept, ...enabledValues] : kept);
  };

  const describedBy = [description && descriptionId, showError && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={describedBy}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      {...props}
      className={['checkbox-group', className].filter(Boolean).join(' ')}
    >
      {label && (
        <span className="checkbox-group-label" id={labelId}>
          {label}
          {required && (
            <span className="checkbox-group-required" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      {description && (
        <span className="checkbox-group-description" id={descriptionId}>
          {description}
        </span>
      )}
      <div className="checkbox-group-items">
        {selectAll && (
          <div className="checkbox-group-item checkbox-group-select-all">
            <Checkbox
              label={selectAllLabel}
              checked={allChecked}
              indeterminate={someChecked}
              disabled={enabled.length === 0}
              onChange={(event) => setAll(event.target.checked)}
            />
          </div>
        )}
        {items.map((item) => (
          <div className="checkbox-group-item" key={item.value}>
            <Checkbox
              label={item.label}
              checked={item.checked}
              disabled={item.disabled}
              name={name}
              value={item.value}
              onChange={(event) => toggle(item.value, event.target.checked)}
            />
          </div>
        ))}
      </div>
      {showError && (
        <span className="checkbox-group-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
