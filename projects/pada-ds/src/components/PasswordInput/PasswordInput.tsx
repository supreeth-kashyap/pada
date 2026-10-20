import { useId, useState, type ComponentPropsWithRef } from 'react';
import { FieldControl } from '../../headless/Field/Field';
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field/Field';
import { Icon } from '../Icon';
import { STRENGTH_LABELS, estimatePasswordStrength, type PasswordStrength } from './passwordStrength';
import './PasswordInput.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface PasswordInputProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  label: string;
  description?: string;
  error?: string;
  /** Show "(optional)" after the label. */
  optional?: boolean;
  /**
   * Show a strength meter: `true` uses `estimatePasswordStrength`; a number (0–4) uses your
   * own score.
   */
  strength?: boolean | PasswordStrength;
  /** Initially show the password as text. */
  defaultVisible?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A password field with a show/hide toggle and an optional strength meter. Defaults to
 * `autoComplete="current-password"`; use `"new-password"` on sign-up and change forms.
 */
export function PasswordInput({
  label,
  description,
  error,
  optional,
  strength,
  defaultVisible = false,
  size = 'md',
  required,
  disabled,
  className,
  autoComplete = 'current-password',
  value,
  defaultValue,
  onChange,
  ...props
}: PasswordInputProps) {
  const id = useId();
  const [visible, setVisible] = useState(defaultVisible);
  const [ownValue, setOwnValue] = useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : ownValue;
  const score = strength === undefined || strength === false ? null : strength === true ? estimatePasswordStrength(current) : strength;

  return (
    <FieldRoot className={cx('password-input-field', className)} invalid={!!error} required={required} disabled={disabled} controlId={id}>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <div className="password-input" data-size={size} data-disabled={disabled ? '' : undefined}>
        <FieldControl asChild>
          <input
            {...props}
            className="password-input-input"
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            autoCapitalize="none"
            spellCheck={false}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            onChange={(event) => {
              if (value === undefined) setOwnValue(event.target.value);
              onChange?.(event);
            }}
          />
        </FieldControl>
        <button
          type="button"
          className="password-input-toggle"
          aria-label="Show password"
          aria-pressed={visible}
          aria-controls={id}
          disabled={disabled}
          onClick={() => setVisible((shown) => !shown)}
        >
          <Icon name={visible ? 'hidden' : 'visible'} size={16} />
        </button>
      </div>
      {score !== null && (
        <div className="password-strength" data-score={score} style={{ ['--pada-password-strength' as string]: score }}>
          <div
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={score}
            aria-valuetext={STRENGTH_LABELS[score]}
            className="password-strength-bars"
          >
            {[1, 2, 3, 4].map((bar) => (
              <span key={bar} className="password-strength-bar" data-filled={bar <= score ? '' : undefined} />
            ))}
          </div>
          <span className="password-strength-label" aria-hidden="true">
            {current ? STRENGTH_LABELS[score] : ''}
          </span>
        </div>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </FieldRoot>
  );
}
