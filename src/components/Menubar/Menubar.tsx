import {
  DropdownMenuPortal as HeadlessPortal,
  MenubarContent as HeadlessContent,
  MenubarRoot as HeadlessRoot,
  MenubarTrigger as HeadlessTrigger,
  type MenubarContentProps as HeadlessContentProps,
  type MenubarRootProps,
  type MenubarTriggerProps,
} from '../../headless/Menu/Menu';
import '../DropdownMenu/DropdownMenu.css';
import './Menubar.css';

export { MenubarMenu, type MenubarMenuProps, type MenubarRootProps, type MenubarTriggerProps } from '../../headless/Menu/Menu';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

/** The bar. Name it with `aria-label` ("Editor"). Restyle through `--pada-menubar-*` tokens. */
export function MenubarRoot({ className, ...props }: MenubarRootProps) {
  return <HeadlessRoot {...props} className={cx('menubar', className)} />;
}

/** A menu's name in the bar. */
export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return <HeadlessTrigger {...props} className={cx('menubar-trigger', className)} />;
}

export interface MenubarContentProps extends HeadlessContentProps {
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
}

/** The open menu, rendered in a portal under its trigger. Use the DropdownMenu item parts inside. */
export function MenubarContent({ container, className, align = 'start', ...props }: MenubarContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessContent align={align} {...props} className={cx('menu', className)} />
    </HeadlessPortal>
  );
}
