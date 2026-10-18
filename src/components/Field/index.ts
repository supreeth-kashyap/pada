import { FieldControl, FieldDescription, FieldError, FieldLabel, FieldRoot } from './Field';

export type { FieldLabelProps } from './Field';
export type { FieldControlProps, FieldErrorProps, FieldRootProps } from '../../headless/Field/Field';

/**
 * A form field that wires a label, any control, a description and an error together.
 *
 * ```tsx
 * <Field.Root invalid={!!error} required>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control type="email" placeholder="you@example.com" />
 *   <Field.Description>We never share it.</Field.Description>
 *   <Field.Error>{error}</Field.Error>
 * </Field.Root>
 * ```
 */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
};
