import { useEffect, useId, useMemo, useState, type ComponentPropsWithRef } from 'react';
import { createPartContext } from '../utils/context';
import { dataFlag } from '../utils/events';
import { Slot } from '../utils/Slot';

interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  hasError: boolean;
  setHasError: (value: boolean) => void;
}

const [FieldProvider, useFieldContext] = createPartContext<FieldContextValue>('Field.Root');

export interface FieldRootProps extends ComponentPropsWithRef<'div'> {
  /** Marks the control invalid (`aria-invalid`) and shows Field.Error. */
  invalid?: boolean;
  /** Marks the control required. */
  required?: boolean;
  /** Disables the control. */
  disabled?: boolean;
  /** Id for the control. Generated when omitted. */
  controlId?: string;
}

/**
 * Wires a label, a control, a description and an error together: ids, `htmlFor`,
 * `aria-describedby`, `aria-invalid`, `required` and `disabled`, for any control.
 */
export function FieldRoot({ invalid = false, required = false, disabled = false, controlId, ...props }: FieldRootProps) {
  const generatedId = useId();
  const id = controlId ?? `${generatedId}control`;
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);
  const value = useMemo(
    () => ({
      controlId: id,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      invalid,
      required,
      disabled,
      hasDescription,
      setHasDescription,
      hasError,
      setHasError,
    }),
    [id, invalid, required, disabled, hasDescription, hasError],
  );
  return (
    <FieldProvider value={value}>
      <div data-invalid={dataFlag(invalid)} data-disabled={dataFlag(disabled)} {...props} />
    </FieldProvider>
  );
}

/** The control's label. */
export function FieldLabel(props: ComponentPropsWithRef<'label'>) {
  const context = useFieldContext('Field.Label');
  return <label htmlFor={context.controlId} data-disabled={dataFlag(context.disabled)} {...props} />;
}

export interface FieldControlProps extends ComponentPropsWithRef<'input'> {
  /** Merge the wiring onto your own control (a textarea, a select, a custom input). */
  asChild?: boolean;
}

/** The input. Gets the id, description and error wiring, `aria-invalid`, `required` and `disabled`. */
export function FieldControl({ asChild, ...props }: FieldControlProps) {
  const context = useFieldContext('Field.Control');
  const describedBy = [context.hasDescription && context.descriptionId, context.hasError && context.errorId].filter(Boolean).join(' ');
  const Component = asChild ? Slot : 'input';
  return (
    <Component
      id={context.controlId}
      aria-describedby={describedBy || undefined}
      aria-invalid={context.invalid || undefined}
      required={context.required || undefined}
      disabled={context.disabled || undefined}
      {...props}
    />
  );
}

/** Help text under the control. */
export function FieldDescription(props: ComponentPropsWithRef<'p'>) {
  const context = useFieldContext('Field.Description');
  const { setHasDescription } = context;
  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return <p id={context.descriptionId} {...props} />;
}

export interface FieldErrorProps extends ComponentPropsWithRef<'p'> {
  /** Render even when the field is valid. */
  forceMount?: boolean;
}

/** The validation message. Rendered (and announced) only while the field is invalid. */
export function FieldError({ forceMount, ...props }: FieldErrorProps) {
  const context = useFieldContext('Field.Error');
  const shown = context.invalid || !!forceMount;
  const { setHasError } = context;
  useEffect(() => {
    if (!shown) return;
    setHasError(true);
    return () => setHasError(false);
  }, [shown, setHasError]);
  if (!shown) return null;
  return <p id={context.errorId} role="alert" {...props} />;
}
