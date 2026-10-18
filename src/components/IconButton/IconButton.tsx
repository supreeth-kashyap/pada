import { Button, type ButtonProps } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon' | 'split' | 'onSplitClick' | 'aria-label'> {
  /** Built-in icon name. */
  icon: string;
  /** Accessible name. Required: an icon alone has no text for screen readers. */
  label: string;
  /** Also show the label in a tooltip on hover and focus. */
  tooltip?: boolean;
}

/** A square button with only an icon. Defaults to the ghost variant. */
export function IconButton({ icon, label, tooltip = false, variant = 'ghost', size = 'md', className, ...props }: IconButtonProps) {
  const button = (
    <Button variant={variant} size={size} aria-label={label} {...props} className={['icon-button', className].filter(Boolean).join(' ')}>
      <Icon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />
    </Button>
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
}
