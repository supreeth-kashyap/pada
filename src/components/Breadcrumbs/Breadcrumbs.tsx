import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Icon } from '../Icon';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Link target. Omit for the current page (the last item) or for plain text. */
  href?: string;
  /** Click handler, e.g. for client-side routing. */
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** Trail from the root to the current page. The last item is the current page. */
  items: BreadcrumbItem[];
  /**
   * Collapse the middle of long trails: show the first item, an expand button, and the last
   * `maxItems - 1` items.
   */
  maxItems?: number;
  /** Render each link yourself (for router links). Receives the item and its default props. */
  renderLink?: (item: BreadcrumbItem, props: { className: string; children: ReactNode }) => ReactNode;
  /** Accessible name of the navigation landmark. */
  label?: string;
}

/** Where the current page sits in the hierarchy (WAI-ARIA APG Breadcrumb). */
export function Breadcrumbs({ items, maxItems, renderLink, label = 'Breadcrumb', className, ...props }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const focusRevealed = useRef(false);

  // The expand button disappears when pressed; move focus to the first item it revealed so
  // keyboard users don't lose their place.
  useEffect(() => {
    if (!expanded || !focusRevealed.current) return;
    focusRevealed.current = false;
    listRef.current?.querySelector<HTMLElement>(':scope > li:nth-child(n + 2) :is(a, button, [tabindex])')?.focus();
  }, [expanded]);
  const collapse = !expanded && maxItems !== undefined && maxItems >= 2 && items.length > maxItems;
  const visible: (BreadcrumbItem | 'ellipsis')[] = collapse
    ? [items[0], 'ellipsis', ...items.slice(items.length - (maxItems - 1))]
    : items;

  return (
    <nav aria-label={label} {...props} className={['breadcrumbs', className].filter(Boolean).join(' ')}>
      <ol ref={listRef} className="breadcrumbs-list">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li key={index} className="breadcrumbs-item">
              {item === 'ellipsis' ? (
                <button
                  type="button"
                  className="breadcrumbs-ellipsis"
                  aria-label="Show all breadcrumbs"
                  onClick={() => {
                    focusRevealed.current = true;
                    setExpanded(true);
                  }}
                >
                  …
                </button>
              ) : isLast ? (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href || item.onClick ? (
                renderLink ? (
                  renderLink(item, { className: 'breadcrumbs-link', children: item.label })
                ) : (
                  <a className="breadcrumbs-link" href={item.href} onClick={item.onClick}>
                    {item.label}
                  </a>
                )
              ) : (
                <span className="breadcrumbs-text">{item.label}</span>
              )}
              {!isLast && <Icon name="chevron_right" size={12} aria-hidden="true" className="breadcrumbs-separator" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
