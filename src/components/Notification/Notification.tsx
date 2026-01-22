import React, { useEffect, useState } from 'react';
import './Notification.css';
import { Icon } from '../Icon';
import { Button } from '../Button';

export type NotificationPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export type NotificationVariant = 'informational' | 'success' | 'warning' | 'error' | 'loading';

export interface NotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  position?: NotificationPosition;
  variant?: NotificationVariant;
  className?: string;
}

const iconByVariant: Record<NotificationVariant, string> = {
  informational: 'info',
  success: 'tick_1',
  warning: 'alert_1',
  error: 'alert_2',
  loading: 'info'
};

export const Notification: React.FC<NotificationProps> = ({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
  position = 'top-right',
  variant = 'informational',
  className = ''
}) => {
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
    <div className={`notification notification--${position} ${open ? 'notification--open' : ''}`.trim()}>
      <div className={`notification__card notification__card--${variant} ${className}`.trim()}>
        <div className="notification__icon">
          <Icon name={iconByVariant[variant]} size="sm" color="Icy" />
        </div>
        <div className="notification__content">
          <div className="notification__text">
            <p className="notification__title">{title}</p>
            {description && <p className="notification__description">{description}</p>}
          </div>
          {actionLabel && (
            <Button size="sm" variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
        <button
          type="button"
          className="notification__dismiss"
          aria-label="Dismiss notification"
          onClick={() => onOpenChange(false)}
        >
          <Icon name="cross_2" size="xs" color="Icy" />
        </button>
      </div>
    </div>
  );
};
