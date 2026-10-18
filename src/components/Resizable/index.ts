import { ResizableHandle, ResizablePanel, ResizableRoot } from './Resizable';

export type { ResizableHandleProps, ResizablePanelProps, ResizableRootProps } from './Resizable';

/**
 * Resizable panels: split views, sidebars and inspectors that people can resize.
 *
 * ```tsx
 * <Resizable.Root onSizesCommit={save}>
 *   <Resizable.Panel defaultSize={25} minSize={15} collapsible>Files</Resizable.Panel>
 *   <Resizable.Handle withGrip aria-label="Resize file list" />
 *   <Resizable.Panel>Editor</Resizable.Panel>
 * </Resizable.Root>
 * ```
 */
export const Resizable = {
  Root: ResizableRoot,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
};
