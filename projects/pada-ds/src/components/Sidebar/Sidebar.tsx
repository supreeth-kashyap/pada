import React from 'react';
import './Sidebar.css';
import { SidebarLogo, type SidebarLogoProps } from './SidebarLogo';
import { SidebarSection } from './SidebarSection';
import { SidebarMenu } from './SidebarMenu';

/** Shape of a single clickable menu item in the data-driven Sidebar API */
export interface SidebarMenuItemData {
  /** Stable identifier — also used to determine the active item */
  id: string;
  /** Visible label */
  label: React.ReactNode;
  /** Optional leading icon (ReactNode or image src) */
  icon?: React.ReactNode | string;
  /** Optional trailing slot (badge, count, etc.) */
  trailing?: React.ReactNode;
  /** Route / URL — when present the item renders as an anchor */
  href?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Mark this item as selected (overrides the Sidebar-level activeId) */
  selected?: boolean;
  disabled?: boolean;
}

/** Shape of a section in the data-driven Sidebar API */
export interface SidebarSectionData {
  /** Optional stable id for the section */
  id?: string;
  /** Section heading label. Omit for an untitled group. */
  label?: React.ReactNode;
  /** Optional icon next to the section label */
  icon?: React.ReactNode | string;
  /** Menu items inside the section */
  items: SidebarMenuItemData[];
}

/** Data accepted by the Sidebar's `data` prop */
export interface SidebarData {
  /**
   * Logo configuration. Defaults to the Pada design-system mark + wordmark.
   * - Omit or set `undefined` to render the default logo.
   * - Pass a string URL to use a custom image.
   * - Pass `SidebarLogoProps` for full control.
   * - Pass `null` to hide the logo header entirely.
   */
  logo?: string | SidebarLogoProps | null;
  /** Optional title / wordmark shown next to the logo (when `logo` is a plain string) */
  title?: React.ReactNode;
  /** Sections rendered top-to-bottom in the menu */
  sections: SidebarSectionData[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Data-driven configuration. When provided, Sidebar renders logo + sections + items automatically. */
  data?: SidebarData;
  /** Currently active menu item id (controlled). Used when items don't set `selected` explicitly. */
  activeId?: string;
  /** Fires when any menu item in the data-driven mode is clicked */
  onItemClick?: (item: SidebarMenuItemData, event: React.MouseEvent<HTMLElement>) => void;
  /** Composition mode — pass `SidebarLogo`, `SidebarSection`, `SidebarMenu` children directly */
  children?: React.ReactNode;
  className?: string;
}

const renderLogo = (
  logo: SidebarData['logo'],
  title: SidebarData['title']
): React.ReactNode => {
  // Explicit opt-out: passing `logo: null` (or `logo: false`) hides the header entirely.
  if (logo === null || (logo as unknown) === false) return null;
  if (typeof logo === 'string') {
    return <SidebarLogo src={logo} title={title} />;
  }
  if (logo && typeof logo === 'object') {
    return <SidebarLogo {...logo} title={logo.title ?? title} />;
  }
  // No logo provided — render the default Pada mark + wordmark (or just the title text if given).
  return <SidebarLogo title={title} />;
};

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      data,
      activeId,
      onItemClick,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = ['sidebar', className].filter(Boolean).join(' ');

    const renderItem = (item: SidebarMenuItemData) => {
      const isSelected =
        item.selected !== undefined ? item.selected : activeId !== undefined && item.id === activeId;
      return (
        <SidebarMenu
          key={item.id}
          label={item.label}
          icon={item.icon}
          trailing={item.trailing}
          href={item.href}
          disabled={item.disabled}
          selected={isSelected}
          onClick={(event) => {
            item.onClick?.(event);
            onItemClick?.(item, event);
          }}
        />
      );
    };

    return (
      <aside ref={ref} className={classes} {...rest}>
        {data ? (
          <>
            {renderLogo(data.logo, data.title)}
            <div className="sidebar__body">
              {data.sections.map((section, index) => (
                <SidebarSection
                  key={section.id ?? (typeof section.label === 'string' ? section.label : index)}
                  label={section.label}
                  icon={section.icon}
                >
                  {section.items.map(renderItem)}
                </SidebarSection>
              ))}
            </div>
          </>
        ) : (
          children
        )}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';
