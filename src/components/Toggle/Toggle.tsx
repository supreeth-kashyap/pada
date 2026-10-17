import { Toggle as HeadlessToggle, type ToggleProps as HeadlessToggleProps } from '../../headless/Toggle/Toggle';
import { Icon } from '../Icon';
import './Toggle.css';

export interface ToggleProps extends HeadlessToggleProps {
  /** Built-in icon name shown before the label. */
  icon?: string;
  /** sm 28px, md 32px, lg 40px. */
  size?: 'sm' | 'md' | 'lg';
}

/** A button that stays pressed: bold, italic, "show archived". Announced with `aria-pressed`. */
export function Toggle({ icon, size = 'md', className, children, ...props }: ToggleProps) {
  return (
    <HeadlessToggle data-size={size} {...props} className={['toggle', className].filter(Boolean).join(' ')}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} aria-hidden="true" />}
      {children}
    </HeadlessToggle>
  );
}
