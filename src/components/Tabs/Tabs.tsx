import React, { Children, isValidElement } from 'react';
import {
  TabsContent as HeadlessContent,
  TabsIndicator,
  TabsList as HeadlessList,
  TabsRoot as HeadlessRoot,
  TabsTrigger as HeadlessTrigger,
  type TabsContentProps,
  type TabsListProps,
  type TabsRootProps as HeadlessRootProps,
  type TabsTriggerProps as HeadlessTriggerProps,
} from '../../headless/Tabs/Tabs';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import './Tabs.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type TabsVariant = 'underline' | 'pills';

export interface TabsRootProps extends HeadlessRootProps {
  /** `underline` (a sliding bar under the selected tab) or `pills` (a sliding filled pill). */
  variant?: TabsVariant;
}

/** Holds the selected tab and sets the visual variant. */
function TabsRoot({ variant = 'underline', className, ...props }: TabsRootProps) {
  return <HeadlessRoot data-variant={variant} {...props} className={cx('tabs', className)} />;
}

/** The tab list, with a sliding indicator under (or behind) the selected tab. */
function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <HeadlessList {...props} className={cx('tabs-list', className)}>
      {children}
      <TabsIndicator className="tabs-indicator" />
    </HeadlessList>
  );
}

export interface TabsTriggerProps extends HeadlessTriggerProps {
  /** Shows a dot (and tells screen readers) that this tab has unread updates. */
  notification?: boolean;
}

/** One tab. */
function TabsTrigger({ notification, className, children, ...props }: TabsTriggerProps) {
  return (
    <HeadlessTrigger {...props} className={cx('tabs-trigger', className)}>
      {children}
      {notification && (
        <>
          <span className="tabs-notification" aria-hidden="true" />
          <VisuallyHidden>, unread updates</VisuallyHidden>
        </>
      )}
    </HeadlessTrigger>
  );
}

/** The panel for one tab. */
function TabsContent({ className, ...props }: TabsContentProps) {
  return <HeadlessContent {...props} className={cx('tabs-content', className)} />;
}

export interface TabsProps {
  children: React.ReactNode;
  label: string;
  /** Initial active index in uncontrolled mode. Ignored when `value` is set. */
  defaultValue?: number;
  /** Controlled active index. */
  value?: number;
  /** Fires whenever the active tab changes. */
  onChange?: (index: number) => void;
}

export interface TabPanelProps {
  label: string;
  children: React.ReactNode;
  /**
   * When `true`, renders a small red notification dot next to the tab's label
   * to signal that this section has new / unread content.
   */
  notification?: boolean;
}

/** One tab of a 1.x `<Tabs>`: its label and its panel content. */
export const TabPanel: React.FC<TabPanelProps> = ({ children }) => <>{children}</>;

/**
 * Tabbed sections (WAI-ARIA APG Tabs): arrow keys move between tabs, Home/End jump to the ends.
 *
 * Pass `<TabPanel label="…">` children for the simple API, or compose the parts:
 * `Tabs.Root` (string values, `variant`, `orientation`, `activationMode`), `Tabs.List`,
 * `Tabs.Trigger`, `Tabs.Content`.
 */
export function Tabs({ children, label, defaultValue = 0, value, onChange }: TabsProps) {
  const panels = Children.toArray(children).filter(isValidElement) as React.ReactElement<TabPanelProps>[];
  return (
    <TabsRoot
      value={value === undefined ? undefined : String(value)}
      defaultValue={String(defaultValue)}
      onValueChange={(next) => onChange?.(Number(next))}
    >
      <TabsList aria-label={label}>
        {panels.map((panel, index) => (
          <TabsTrigger key={index} value={String(index)} notification={panel.props.notification}>
            {panel.props.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((panel, index) => (
        <TabsContent key={index} value={String(index)}>
          {panel}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}

Tabs.Root = TabsRoot;
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
