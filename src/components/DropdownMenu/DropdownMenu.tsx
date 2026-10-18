import type { ComponentPropsWithRef, ReactNode } from 'react';
import {
  DropdownMenuCheckboxItem as HeadlessCheckboxItem,
  DropdownMenuContent as HeadlessContent,
  DropdownMenuGroup as HeadlessGroup,
  DropdownMenuItem as HeadlessItem,
  DropdownMenuItemIndicator as HeadlessItemIndicator,
  DropdownMenuLabel as HeadlessLabel,
  DropdownMenuPortal as HeadlessPortal,
  DropdownMenuRadioItem as HeadlessRadioItem,
  DropdownMenuSeparator as HeadlessSeparator,
  DropdownMenuSubContent as HeadlessSubContent,
  DropdownMenuSubTrigger as HeadlessSubTrigger,
  type DropdownMenuCheckboxItemProps as HeadlessCheckboxItemProps,
  type DropdownMenuContentProps as HeadlessContentProps,
  type DropdownMenuItemProps as HeadlessItemProps,
  type DropdownMenuRadioItemProps as HeadlessRadioItemProps,
  type DropdownMenuSubContentProps as HeadlessSubContentProps,
  type DropdownMenuSubTriggerProps as HeadlessSubTriggerProps,
} from '../../headless/Menu/Menu';
import { Icon } from '../Icon';
import './DropdownMenu.css';

export {
  DropdownMenuRadioGroup,
  DropdownMenuRoot,
  DropdownMenuSub,
  DropdownMenuTrigger,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuRootProps,
  type DropdownMenuSubProps,
  type DropdownMenuTriggerProps,
} from '../../headless/Menu/Menu';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface DropdownMenuContentProps extends HeadlessContentProps {
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
}

/** The menu panel, rendered in a portal and animated from its trigger. */
export function DropdownMenuContent({ container, className, ...props }: DropdownMenuContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessContent {...props} className={cx('menu', className)} />
    </HeadlessPortal>
  );
}

export interface DropdownMenuItemProps extends HeadlessItemProps {
  /** Built-in icon name shown before the label. */
  icon?: string;
  /** Keyboard shortcut hint shown after the label, e.g. "⌘D". Display only. */
  shortcut?: string;
  /** Destructive actions use the danger colours. */
  tone?: 'default' | 'danger';
}

const itemContent = (icon: string | undefined, children: ReactNode, shortcut: string | undefined) => (
  <>
    {icon && <Icon name={icon} size={16} aria-hidden="true" className="menu-item-icon" />}
    <span className="menu-item-label">{children}</span>
    {shortcut && <kbd className="menu-shortcut">{shortcut}</kbd>}
  </>
);

/** An action. Chosen with click, Enter or Space; closes the menu unless `onSelect` prevents it. */
export function DropdownMenuItem({ icon, shortcut, tone = 'default', className, children, asChild, ...props }: DropdownMenuItemProps) {
  return (
    <HeadlessItem data-tone={tone} asChild={asChild} {...props} className={cx('menu-item', className)}>
      {asChild ? children : itemContent(icon, children, shortcut)}
    </HeadlessItem>
  );
}

export type DropdownMenuCheckboxItemProps = Omit<HeadlessCheckboxItemProps, 'asChild'> & Pick<DropdownMenuItemProps, 'shortcut'>;

/** A toggle with a check mark. */
export function DropdownMenuCheckboxItem({ shortcut, className, children, ...props }: DropdownMenuCheckboxItemProps) {
  return (
    <HeadlessCheckboxItem {...props} className={cx('menu-item', className)}>
      <span className="menu-item-indicator">
        <HeadlessItemIndicator>
          <Icon name="tick_1" size={14} aria-hidden="true" />
        </HeadlessItemIndicator>
      </span>
      {itemContent(undefined, children, shortcut)}
    </HeadlessCheckboxItem>
  );
}

export type DropdownMenuRadioItemProps = Omit<HeadlessRadioItemProps, 'asChild'> & Pick<DropdownMenuItemProps, 'shortcut'>;

/** One option in a RadioGroup, with a dot when checked. */
export function DropdownMenuRadioItem({ shortcut, className, children, ...props }: DropdownMenuRadioItemProps) {
  return (
    <HeadlessRadioItem {...props} className={cx('menu-item', className)}>
      <span className="menu-item-indicator">
        <HeadlessItemIndicator className="menu-radio-dot" />
      </span>
      {itemContent(undefined, children, shortcut)}
    </HeadlessRadioItem>
  );
}

/** A non-focusable heading for a group of items. */
export function DropdownMenuLabel({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <HeadlessLabel {...props} className={cx('menu-label', className)} />;
}

/** Groups related items. */
export function DropdownMenuGroup(props: ComponentPropsWithRef<'div'>) {
  return <HeadlessGroup {...props} />;
}

/** A divider between groups of items. */
export function DropdownMenuSeparator({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <HeadlessSeparator {...props} className={cx('menu-separator', className)} />;
}

export type DropdownMenuSubTriggerProps = Omit<HeadlessSubTriggerProps, 'asChild'> & Pick<DropdownMenuItemProps, 'icon'>;

/** The item that opens a submenu, with a chevron. */
export function DropdownMenuSubTrigger({ icon, className, children, ...props }: DropdownMenuSubTriggerProps) {
  return (
    <HeadlessSubTrigger {...props} className={cx('menu-item', className)}>
      {itemContent(icon, children, undefined)}
      <Icon name="chevron_right" size={14} aria-hidden="true" className="menu-item-chevron" />
    </HeadlessSubTrigger>
  );
}

export interface DropdownMenuSubContentProps extends HeadlessSubContentProps {
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
}

/** The submenu panel. */
export function DropdownMenuSubContent({ container, className, ...props }: DropdownMenuSubContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessSubContent {...props} className={cx('menu', className)} />
    </HeadlessPortal>
  );
}
