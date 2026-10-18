import {
  ToggleGroupItem as HeadlessItem,
  ToggleGroupRoot as HeadlessRoot,
  type ToggleGroupItemProps as HeadlessItemProps,
  type ToggleGroupRootProps as HeadlessRootProps,
} from '../../headless/Toggle/Toggle';
import { Icon } from '../Icon';
import '../Toggle/Toggle.css';
import './ToggleGroup.css';

export type ToggleGroupRootProps = HeadlessRootProps & {
  /** sm 28px, md 32px, lg 40px. */
  size?: 'sm' | 'md' | 'lg';
};

/** A segmented set of toggles. Name it with `aria-label`. */
export function ToggleGroupRoot({ size = 'md', className, ...props }: ToggleGroupRootProps) {
  return <HeadlessRoot data-size={size} {...props} className={['toggle-group', className].filter(Boolean).join(' ')} />;
}

export interface ToggleGroupItemProps extends HeadlessItemProps {
  /** Built-in icon name shown before the label. Icon-only items need an `aria-label`. */
  icon?: string;
}

/** One item in a ToggleGroup. */
export function ToggleGroupItem({ icon, className, children, ...props }: ToggleGroupItemProps) {
  return (
    <HeadlessItem {...props} className={['toggle', className].filter(Boolean).join(' ')}>
      {icon && <Icon name={icon} size={16} aria-hidden="true" />}
      {children}
    </HeadlessItem>
  );
}
