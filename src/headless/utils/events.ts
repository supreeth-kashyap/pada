/**
 * Runs the consumer's handler first and Pada's own handler after it, unless the consumer
 * called `event.preventDefault()`. This is how every part lets consumers opt out of
 * built-in behaviour (`onKeyDown={(e) => e.preventDefault()}` stops a menu's arrow keys).
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  consumerHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
) {
  return (event: E) => {
    consumerHandler?.(event);
    if (!event.defaultPrevented) ourHandler(event);
  };
}

/** `data-state` value for anything that opens and closes. */
export const openState = (open: boolean) => (open ? 'open' : 'closed');

/** Boolean data attribute: present (empty string) when true, absent otherwise. */
export const dataFlag = (value: boolean | undefined) => (value ? '' : undefined);
