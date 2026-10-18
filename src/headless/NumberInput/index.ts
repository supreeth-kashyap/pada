import { NumberInputDecrement, NumberInputIncrement, NumberInputInput, NumberInputRoot } from './NumberInput';

export * from './NumberInput';
export { createNumberFormatter, type NumberFormatter } from './numberFormat';

/**
 * Headless number field (WAI-ARIA APG Spinbutton) with locale-aware formatting.
 *
 * ```tsx
 * <NumberInput.Root defaultValue={5} min={0} max={10} formatOptions={{ style: 'currency', currency: 'EUR' }}>
 *   <NumberInput.Decrement>−</NumberInput.Decrement>
 *   <NumberInput.Input aria-label="Price" />
 *   <NumberInput.Increment>+</NumberInput.Increment>
 * </NumberInput.Root>
 * ```
 */
export const NumberInput = {
  Root: NumberInputRoot,
  Input: NumberInputInput,
  Increment: NumberInputIncrement,
  Decrement: NumberInputDecrement,
};
