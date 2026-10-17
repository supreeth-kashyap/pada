import type { ComponentPropsWithRef } from 'react';
import {
  FieldControl as HeadlessControl,
  FieldDescription as HeadlessDescription,
  FieldError as HeadlessError,
  FieldLabel as HeadlessLabel,
  FieldRoot as HeadlessRoot,
  type FieldControlProps,
  type FieldErrorProps,
  type FieldRootProps,
} from '../../headless/Field/Field';
import './Field.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

/** A form field: label, control, description and error, wired for assistive technology. */
export function FieldRoot({ className, ...props }: FieldRootProps) {
  return <HeadlessRoot {...props} className={cx('field', className)} />;
}

export interface FieldLabelProps extends ComponentPropsWithRef<'label'> {
  /** Show "(optional)" after the label. Required fields get a marker automatically. */
  optional?: boolean;
}

/** The label. Required fields show an asterisk (hidden from screen readers: the input is `required`). */
export function FieldLabel({ optional, className, children, ...props }: FieldLabelProps) {
  return (
    <HeadlessLabel {...props} className={cx('field-label', className)}>
      {children}
      <span className="field-required" aria-hidden="true">
        *
      </span>
      {optional && <span className="field-optional">(optional)</span>}
    </HeadlessLabel>
  );
}

/**
 * The input, styled. Pass `asChild` to wire your own control (a select, a textarea) instead;
 * it then keeps its own styles.
 */
export function FieldControl({ className, asChild, ...props }: FieldControlProps) {
  return <HeadlessControl asChild={asChild} {...props} className={cx(!asChild && 'field-input', className)} />;
}

/** Help text under the control. */
export function FieldDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return <HeadlessDescription {...props} className={cx('field-description', className)} />;
}

/** Validation message, shown while the field is `invalid`. */
export function FieldError({ className, ...props }: FieldErrorProps) {
  return <HeadlessError {...props} className={cx('field-error', className)} />;
}
