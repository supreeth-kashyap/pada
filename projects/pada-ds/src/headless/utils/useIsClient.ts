import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** True after hydration. Server rendering (and the hydration pass) see false. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
