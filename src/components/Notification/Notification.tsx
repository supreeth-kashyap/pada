import React, { useEffect, useState } from 'react';
import './Notification.css';
import { Icon } from '../Icon';

export type NotificationPosition =
  | 'top-left'
  | 'top'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-center'
  | 'bottom-right';

export interface NotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  visual?: React.ReactElement<typeof Icon>;
  /**
   * Where the toast appears and slides in from. Default: 'top-right'.
   */
  position?: NotificationPosition;
  /**
   * Alias for position; if provided it overrides position.
   */
  direction?: NotificationPosition;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  open,
  onOpenChange,
  title,
  subtitle,
  visual,
  position = 'top-right',
  direction,
  className = ''
}) => {
  const placement =
    direction ??
    position ??
    'top-right';

  const resolvedPosition =
    placement === 'top-center'
      ? 'top'
      : placement === 'bottom-center'
        ? 'bottom'
        : placement;

  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = window.setTimeout(() => setIsVisible(false), 200);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  if (!isVisible) return null;

  return (
    <div className={`notification notification--${resolvedPosition} ${open ? 'notification--open' : ''}`.trim()}>
      {/* A polite live region, so screen readers announce the notification when it appears. */}
      <div className={`notification__card ${className}`.trim()} role="status" aria-live="polite" aria-atomic="true">
        <div className="notification__icon">
          {visual ?? <Icon name="bell" size={24} color="var(--pada-color-neutral-600)" />}
        </div>
        <div className="notification__content">
          <div className="notification__text">
            <p className="notification__title">{title}</p>
            {subtitle && <p className="notification__description">{subtitle}</p>}
          </div>
        </div>
        <button type="button" className="notification__dismiss" aria-label="Dismiss notification" onClick={() => onOpenChange(false)}>
          <Icon name="cross_1" size={16} color="var(--pada-color-neutral-600)" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
