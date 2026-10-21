import type { ReactNode } from 'react';
import { DropdownMenu } from 'pada-ds';
import { AngularLogo, ExternalArrow, ReactLogo } from './icons';

export interface LinksMenuProps {
  /** Menu heading, e.g. "Storybook". */
  label: string;
  react: string;
  angular: string;
  /** The trigger element (a button); it receives the menu-button ARIA. */
  children: ReactNode;
}

// The menu item, not a link: DropdownMenu.Item prevents Enter's default, so a nested <a> would
// only open on click. onSelect opens the page in a new tab for pointer and keyboard alike.
const open = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');

/** A header link that goes to two places: the React and the Angular version of a destination. */
export function LinksMenu({ label, react, angular, children }: LinksMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={8} className="links-menu">
        <DropdownMenu.Label>{label}</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={open(react)} textValue="React">
          <ReactLogo size={16} className="brand-react" />
          React
          <ExternalArrow size={13} className="links-menu-ext" />
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={open(angular)} textValue="Angular">
          <AngularLogo size={16} className="brand-angular" />
          Angular
          <ExternalArrow size={13} className="links-menu-ext" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
