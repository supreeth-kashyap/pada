import { ContextMenuTrigger as HeadlessTrigger, type ContextMenuTriggerProps } from '../../headless/Menu/Menu';
import './ContextMenu.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

/** The area that opens the menu on right-click, Shift+F10 or a long press. */
export function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return <HeadlessTrigger {...props} className={cx('context-menu-trigger', className)} />;
}

export type { ContextMenuRootProps, ContextMenuTriggerProps } from '../../headless/Menu/Menu';
export { ContextMenuRoot } from '../../headless/Menu/Menu';
