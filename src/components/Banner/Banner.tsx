import React from 'react';
import './Banner.css';
import { Icon } from '../Icon';
import { Button } from '../Button';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface BannerProps {
  header: string;
  iconName?: string | null;
  buttonLabel?: string;
  onButtonClick?: () => void;
  text?: string;
  variant?: BannerVariant;
  onClose?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  header,
  iconName,
  buttonLabel,
  onButtonClick,
  text,
  variant = 'info',
  onClose,
  className = '',
}) => {
  return (
    <div className={`banner banner--${variant} ${className}`}>
      <div className="banner__content">
        {iconName && (
          <div className="banner__icon">
            <Icon name={iconName} size="sm" color={getIconColor(variant)} />
          </div>
        )}
        <div className="banner__main">
          <div className="banner__header-row">
            <span className="banner__header">{header}</span>
            {buttonLabel && onButtonClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onButtonClick}
              >
                {buttonLabel}
              </Button>
            )}
          </div>
          {text && <div className="banner__text">{text}</div>}
        </div>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close banner"
          className="banner__close"
        >
          <Icon name="cross_1" size="sm" color={getIconColor(variant)} />
        </Button>
      )}
    </div>
  );
};

function getIconColor(variant: BannerVariant): 'Blue' | 'Green' | 'Yellow' | 'Red' | 'Icy' {
  switch (variant) {
    case 'info':
      return 'Blue';
    case 'success':
      return 'Green';
    case 'warning':
      return 'Yellow';
    case 'error':
      return 'Red';
    case 'neutral':
      return 'Icy';
    default:
      return 'Icy';
  }
}
