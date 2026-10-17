import { createContext, useContext } from 'react';

/**
 * Where portalled parts render when they are not given a `container`. Defaults to
 * `document.body`. A themed subtree provides its own element here, so menus and dialogs opened
 * inside it keep its theme (`ThemeProvider` does this for `target="element"`).
 */
export const PortalContainerContext = createContext<Element | null>(null);

export const usePortalContainer = () => useContext(PortalContainerContext);
