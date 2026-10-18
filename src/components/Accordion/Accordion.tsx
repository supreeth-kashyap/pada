import React from 'react';
import {
  AccordionContent as HeadlessContent,
  AccordionHeader as HeadlessHeader,
  AccordionItem as HeadlessItem,
  AccordionRoot as HeadlessRoot,
  AccordionTrigger as HeadlessTrigger,
  type AccordionItemProps,
  type AccordionRootProps,
  type AccordionTriggerProps as HeadlessTriggerProps,
} from '../../headless/Accordion/Accordion';
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  type CollapsibleContentProps,
} from '../../headless/Collapsible/Collapsible';
import { Icon } from '../Icon';
import './Accordion.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/** Leading icon, title and the chevron that turns when the section opens. */
function TriggerInner({ iconName, children }: { iconName?: string; children: React.ReactNode }) {
  return (
    <>
      {iconName ? (
        <span className="accordion-header__icon" aria-hidden="true">
          <Icon name={iconName} size={20} />
        </span>
      ) : null}
      <span className="accordion-header__title">{children}</span>
      <span className="accordion-header__chevron" aria-hidden="true">
        <Icon name="chevron_down" size={20} />
      </span>
    </>
  );
}

/** Content wrapper: the outer element animates its height; the body holds the padding. */
function ContentInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="accordion-content-clip">
      <div className="accordion__body">{children}</div>
    </div>
  );
}

/** Holds which items are open: `type="single"` (optionally `collapsible`) or `type="multiple"`. */
function AccordionRoot({ className, ...props }: AccordionRootProps) {
  return <HeadlessRoot {...props} className={cx('accordion-root', className)} />;
}

/** One section. */
function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <HeadlessItem {...props} className={cx('accordion', className)} />;
}

export interface AccordionTriggerProps extends HeadlessTriggerProps {
  /** Built-in icon name shown before the title. */
  iconName?: string;
  /** Level of the heading that wraps the trigger. @default 3 */
  headingLevel?: HeadingLevel;
}

/** The section's heading and toggle button, with an optional leading icon and a chevron. */
function AccordionTrigger({ iconName, headingLevel = 3, className, children, ...props }: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <HeadlessHeader asChild>
      <Heading className="accordion-heading">
        <HeadlessTrigger {...props} className={cx('accordion-header', className)}>
          <TriggerInner iconName={iconName}>{children}</TriggerInner>
        </HeadlessTrigger>
      </Heading>
    </HeadlessHeader>
  );
}

/** The section's content; its height animates open and closed. */
function AccordionContentPart({ className, children, ...props }: CollapsibleContentProps) {
  return (
    <HeadlessContent {...props} className={cx('accordion-content', className)}>
      <ContentInner>{children}</ContentInner>
    </HeadlessContent>
  );
}

export interface AccordionProps {
  header: React.ReactNode;
  /** Built-in icon name shown before the header. */
  headerIconName?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  disabled?: boolean;
  /** Level of the heading that wraps the header button. @default 3 */
  headingLevel?: HeadingLevel;
}

/**
 * Collapsible sections (WAI-ARIA APG Accordion).
 *
 * `<Accordion header="…">` is one standalone section (the 1.x API). For a group, compose the
 * parts: `Accordion.Root` (`type="single"` with optional `collapsible`, or `type="multiple"`),
 * `Accordion.Item`, `Accordion.Trigger` and `Accordion.Content`. Arrow keys and Home/End move
 * between the triggers of a group.
 */
export function Accordion({
  header,
  children,
  headerIconName,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  disabled = false,
  headingLevel = 3,
}: AccordionProps) {
  const Heading = `h${headingLevel}` as const;
  const triggerId = React.useId();
  return (
    <CollapsibleRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={cx('accordion', className)}
    >
      <Heading className="accordion-heading">
        <CollapsibleTrigger id={triggerId} className="accordion-header">
          <TriggerInner iconName={headerIconName}>{header}</TriggerInner>
        </CollapsibleTrigger>
      </Heading>
      <CollapsibleContent role="region" aria-labelledby={triggerId} className="accordion-content">
        <ContentInner>{children}</ContentInner>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

Accordion.Root = AccordionRoot;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContentPart;

export interface AccordionHeaderProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: React.ReactNode;
  iconName?: string;
  collapsed?: boolean;
}

/** @deprecated Use `Accordion.Trigger` inside `Accordion.Item`. The 1.x header button on its own. */
export function AccordionHeader({ title, iconName, collapsed = true, className, type = 'button', ...props }: AccordionHeaderProps) {
  return (
    <button
      type={type}
      className={cx('accordion-header', className)}
      data-state={collapsed ? 'closed' : 'open'}
      data-disabled={props.disabled ? '' : undefined}
      {...props}
    >
      <TriggerInner iconName={iconName}>{title}</TriggerInner>
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** @deprecated Use `Accordion.Content` inside `Accordion.Item`. The 1.x body on its own. */
export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  return (
    <div className={cx('accordion__body', className)} {...props}>
      {children}
    </div>
  );
}
