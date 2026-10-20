import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './Alert.css';

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Colour and default icon by meaning. */
  tone?: AlertTone;
  /** Bold first line. */
  title?: ReactNode;
  /** Built-in icon name; `false` hides the icon. Defaults to one that matches the tone. */
  icon?: string | false;
  /** Buttons or links shown under the message. */
  actions?: ReactNode;
  /** Shows a dismiss button that calls this. */
  onDismiss?: () => void;
  /**
   * Announce the alert when it appears: `polite` (role="status") or `assertive` (role="alert",
   * for errors that need immediate attention). Leave unset for alerts present on page load.
   */
  live?: 'polite' | 'assertive';
}

const TONE_ICON: Record<AlertTone, string> = {
  neutral: 'info',
  info: 'info',
  success: 'tick_2',
  warning: 'alert_1',
  danger: 'alert_2',
};

/** An inline, persistent message: a callout in a form or page, not a transient toast. */
export function Alert({ tone = 'info', title, icon, actions, onDismiss, live, className, children, ...props }: AlertProps) {
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  const iconName = icon === false ? null : (icon ?? TONE_ICON[tone]);
  return (
    <div role={role} data-tone={tone} {...props} className={['alert', className].filter(Boolean).join(' ')}>
      {iconName && <Icon name={iconName} size={16} aria-hidden="true" className="alert-icon" />}
      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        {children && <div className="alert-description">{children}</div>}
        {actions && <div className="alert-actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="alert-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="cross_1" size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
