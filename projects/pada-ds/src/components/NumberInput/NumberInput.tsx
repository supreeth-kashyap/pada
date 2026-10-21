import { useId } from 'react';
import { FieldControl } from '../../headless/Field/Field';
import {
  NumberInputDecrement,
  NumberInputIncrement,
  NumberInputInput,
  NumberInputRoot,
  type NumberInputRootProps,
} from '../../headless/NumberInput/NumberInput';
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field/Field';
import './NumberInput.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface NumberInputProps extends Omit<NumberInputRootProps, 'children' | 'inputId'> {
  label: string;
  /** Help text under the field. */
  description?: string;
  /** Error message; marks the field invalid. */
  error?: string;
  required?: boolean;
  /** Show "(optional)" after the label. */
  optional?: boolean;
  placeholder?: string;
  /** `stacked`: up/down arrows at the end; `split`: minus at the start and plus at the end; `none`. */
  stepper?: 'stacked' | 'split' | 'none';
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
}

const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path d={up ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sign = ({ plus }: { plus?: boolean }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d={plus ? 'M3 8h10M8 3v10' : 'M3 8h10'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * A number field (WAI-ARIA APG Spinbutton): type a value, or use Up/Down, PageUp/PageDown and
 * Home/End, or the steppers (hold to repeat). Values are formatted with `formatOptions`
 * (currency, percent, units) and typed text is parsed in the same locale.
 */
export function NumberInput({
  label,
  description,
  error,
  required,
  optional,
  placeholder,
  stepper = 'stacked',
  size = 'md',
  disabled,
  className,
  ...props
}: NumberInputProps) {
  const id = useId();
  return (
    <FieldRoot className={cx('number-input-field', className)} invalid={!!error} required={required} disabled={disabled} controlId={id}>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <NumberInputRoot {...props} disabled={disabled} inputId={id} className="number-input" data-stepper={stepper} data-size={size}>
        {stepper === 'split' && (
          <NumberInputDecrement className="number-input-step">
            <Sign />
          </NumberInputDecrement>
        )}
        <FieldControl asChild>
          <NumberInputInput className="number-input-input" placeholder={placeholder} />
        </FieldControl>
        {stepper === 'split' && (
          <NumberInputIncrement className="number-input-step">
            <Sign plus />
          </NumberInputIncrement>
        )}
        {stepper === 'stacked' && (
          <span className="number-input-steppers">
            <NumberInputIncrement className="number-input-step">
              <Chevron up />
            </NumberInputIncrement>
            <NumberInputDecrement className="number-input-step">
              <Chevron />
            </NumberInputDecrement>
          </span>
        )}
      </NumberInputRoot>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </FieldRoot>
  );
}
