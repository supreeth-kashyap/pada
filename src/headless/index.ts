// pada-ds/headless: behaviour, keyboard handling, focus and ARIA without any styles.
// Every part exposes its state through data-* and aria-* attributes for you to style.
// The styled components in `pada-ds` are built on these parts.

export * from './Dialog';
export * from './Popover';
export * from './Tooltip';
export * from './Menu';
export * from './Tabs';
export * from './Field';
export * from './Toggle';
export * from './Combobox';
export * from './Collapsible';
export * from './Accordion';
export * from './NumberInput';
export * from './Calendar';
export * from './Tree';
export * from './HoverCard';

export { Slot, type SlotProps } from './utils/Slot';
export { Portal, type PortalProps } from './utils/Portal';
export { useIsClient } from './utils/useIsClient';
export { PortalContainerContext, usePortalContainer } from './utils/portalContainer';
export { VisuallyHidden, type VisuallyHiddenProps } from './utils/VisuallyHidden';
export { composeRefs, useComposedRefs } from './utils/refs';
export { composeEventHandlers } from './utils/events';
export { useControllableState, type ControllableStateOptions } from './utils/useControllableState';
export { usePresence } from './utils/usePresence';
export { useDismissable, type DismissEvent, type DismissableOptions } from './utils/useDismissable';
export { useFocusScope, getTabbable, type AutoFocusEvent, type FocusScopeOptions } from './utils/focus';
export { useScrollLock, useHideOthers } from './utils/modal';
export { useFloatingPosition, type FloatingOptions, type Side, type Align } from './utils/floating';
export { findNextIndex, findTypeaheadIndex, keyToNavigation, type NavigableItem, type NavigationKey } from './utils/navigation';
export { useTypeahead } from './utils/useTypeahead';
