import React from 'react';
import './Banner.css';
import { Icon } from '../Icon';
import { Button } from '../Button';

export interface BannerProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  visual?: React.ReactElement<typeof Icon>;
  button?: React.ReactElement<typeof Button>;
  onButtonClick?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  visual,
  button,
  onButtonClick,
  className = '',
}) => {
  return (
    <div className={`banner ${className}`}>
      {visual && <div className="banner__visual">{visual}</div>}
      <div className="banner__body">
        <div className="banner__title">{title}</div>
        {subtitle && <div className="banner__subtitle">{subtitle}</div>}
      </div>
      {button && (
        <div className="banner__button" onClick={onButtonClick}>
          {button}
        </div>
      )}
    </div>
  );
};
