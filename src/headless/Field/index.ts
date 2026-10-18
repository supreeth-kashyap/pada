import { FieldControl, FieldDescription, FieldError, FieldLabel, FieldRoot } from './Field';

export * from './Field';

/**
 * Headless form field wiring for any control.
 *
 * ```tsx
 * <Field.Root invalid={!!error} required>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control type="email" />
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
