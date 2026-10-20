import { ResizableHandle, ResizablePanel, ResizableRoot } from './Resizable';

export * from './Resizable';

/**
 * Headless resizable panels (WAI-ARIA APG Window Splitter).
 *
 * ```tsx
 * <Resizable.Root orientation="horizontal" onSizesCommit={save}>
 *   <Resizable.Panel defaultSize={25} minSize={15} collapsible>Sidebar</Resizable.Panel>
 *   <Resizable.Handle aria-label="Resize sidebar" />
 *   <Resizable.Panel>Editor</Resizable.Panel>
 * </Resizable.Root>
 * ```
 */
export const Resizable = {
  Root: ResizableRoot,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
};
