import { ControlLabel, type ControlLabelProps } from './ControlLabel';

export type FormLabelProps = ControlLabelProps;

/**
 * A label with optional required and "(optional)" markers.
 *
 * @deprecated Since 2.0. Use `Field` (`Field.Root`, `Field.Label`, `Field.Control`,
 * `Field.Description`, `Field.Error`), which also wires the control's id, description and
 * error. Removed in 3.0.
 */
export const FormLabel = (props: FormLabelProps) => <ControlLabel {...props} />;
