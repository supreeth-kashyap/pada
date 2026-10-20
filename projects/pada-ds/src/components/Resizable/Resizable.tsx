import {
  ResizableHandle as HeadlessHandle,
  ResizablePanel,
  ResizableRoot as HeadlessRoot,
  type ResizableHandleProps as HeadlessHandleProps,
  type ResizablePanelProps,
  type ResizableRootProps,
} from '../../headless/Resizable/Resizable';
import { Icon } from '../Icon';
import './Resizable.css';

export type { ResizablePanelProps, ResizableRootProps };

/**
 * A group of resizable panels. Panels and handles must be direct children, in order. Restyle
 * through `--pada-resizable-*` tokens.
 */
export function ResizableRoot({ className, ...props }: ResizableRootProps) {
  return <HeadlessRoot {...props} className={['resizable', className].filter(Boolean).join(' ')} />;
}

export interface ResizableHandleProps extends HeadlessHandleProps {
  /** Show a grip in the middle of the line, so the handle is easier to find. */
  withGrip?: boolean;
}

/**
 * The line between two panels. Drag it, or focus it and use the arrow keys; Home and End jump to
 * the limits and Enter collapses a collapsible panel. Named "Resize" unless you pass a label.
 */
export function ResizableHandle({ withGrip = false, className, 'aria-label': label, ...props }: ResizableHandleProps) {
  return (
    <HeadlessHandle
      aria-label={label ?? (props['aria-labelledby'] ? undefined : 'Resize')}
      {...props}
      className={['resizable-handle', className].filter(Boolean).join(' ')}
    >
      {withGrip && (
        <span className="resizable-grip" aria-hidden="true">
          <Icon name="drag_vertical" size={12} />
        </span>
      )}
    </HeadlessHandle>
  );
}

export { ResizablePanel };
