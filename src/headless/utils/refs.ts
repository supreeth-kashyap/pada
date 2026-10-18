import { useCallback, type Ref, type RefCallback } from 'react';

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') return ref(value);
  if (ref) (ref as { current: T | null }).current = value;
};

/** One ref callback that writes to every ref passed in. Cleanups returned by callback refs run on detach. */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    return () => {
      cleanups.forEach((cleanup, index) => {
        if (typeof cleanup === 'function') cleanup();
        else setRef(refs[index], null);
      });
    };
  };
}

/** Memoised {@link composeRefs}, so React does not detach and reattach the refs on every render. */
export function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs);
}
