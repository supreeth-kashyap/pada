import { useId, type CSSProperties, type ReactNode } from 'react';
import { useControllableState } from '../../headless/utils/useControllableState';
import { Icon } from '../Icon';
import './RadioCard.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface RadioCardOption {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  /** Built-in icon name shown at the top of the card. */
  icon?: string;
  /** Extra content at the end, e.g. a price. */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface RadioCardGroupProps {
  label: ReactNode;
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Help text under the label. */
  description?: ReactNode;
  /** Name for form submission. Generated when omitted. */
  name?: string;
  /** Cards per row (they wrap to fewer on narrow screens). @default 3 */
  columns?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * A single choice presented as cards with a title, description, icon and extra content (plans,
 * shipping speeds, templates). Built on native radio inputs: Tab reaches the group, arrow keys
 * move and select, and the value submits with forms.
 */
export function RadioCardGroup({
  label,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  description,
  name,
  columns = 3,
  disabled = false,
  required,
  className,
}: RadioCardGroupProps) {
  const id = useId();
  const [value, setValue] = useControllableState<string | undefined>({ prop: valueProp, defaultProp: defaultValue, onChange: (next) => next !== undefined && onValueChange?.(next) });
  const groupName = name ?? `${id}radio-card`;

  return (
    <fieldset
      className={cx('radio-card-group', className)}
      disabled={disabled}
      aria-describedby={description ? `${id}-description` : undefined}
      style={{ '--pada-radio-card-columns': columns } as CSSProperties}
    >
      <legend className="radio-card-legend">{label}</legend>
      {description && (
        <p id={`${id}-description`} className="radio-card-group-description">
          {description}
        </p>
      )}
      <div className="radio-card-grid">
        {options.map((option) => {
          const checked = value === option.value;
          const optionId = `${id}${option.value}`;
          return (
            <label
              key={option.value}
              className="radio-card"
              data-checked={checked ? '' : undefined}
              data-disabled={option.disabled || disabled ? '' : undefined}
            >
              <input
                type="radio"
                className="radio-card-input"
                name={groupName}
                value={option.value}
                checked={checked}
                disabled={option.disabled}
                required={required}
                aria-describedby={option.description ? `${optionId}-description` : undefined}
                onChange={() => setValue(option.value)}
              />
              <span className="radio-card-indicator" aria-hidden="true" />
              {option.icon && (
                <span className="radio-card-icon" aria-hidden="true">
                  <Icon name={option.icon} size={20} />
                </span>
              )}
              <span className="radio-card-title">{option.title}</span>
              {option.description && (
                <span id={`${optionId}-description`} className="radio-card-description">
                  {option.description}
                </span>
              )}
              {option.meta && <span className="radio-card-meta">{option.meta}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
