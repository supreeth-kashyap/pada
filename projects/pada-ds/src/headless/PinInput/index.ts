import { PinInputInput, PinInputRoot } from './PinInput';

export * from './PinInput';

/**
 * Headless PIN / one-time-code input: one box per character.
 *
 * ```tsx
 * <PinInput.Root length={6} aria-label="Verification code" onComplete={verify}>
 *   {[0, 1, 2, 3, 4, 5].map((index) => <PinInput.Input key={index} index={index} />)}
 * </PinInput.Root>
 * ```
 */
export const PinInput = {
  Root: PinInputRoot,
  Input: PinInputInput,
};
