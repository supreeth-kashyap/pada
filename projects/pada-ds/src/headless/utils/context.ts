import { createContext, useContext } from 'react';

/**
 * Context for one compound component. The hook throws a readable error when a part is used
 * outside its root (`<Dialog.Title> must be used inside <Dialog.Root>`).
 */
export function createPartContext<T>(rootName: string) {
  const Context = createContext<T | null>(null);
  Context.displayName = `${rootName}Context`;
  const usePartContext = (partName: string): T => {
    const value = useContext(Context);
    if (value === null) throw new Error(`<${partName}> must be used inside <${rootName}>.`);
    return value;
  };
  return [Context.Provider, usePartContext, Context] as const;
}
