import React from 'react';
import './Banner.css';
import { Icon } from '../Icon';
import { Button } from '../Button';

export interface BannerProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /**
   * Optional leading visual. Pass either:
   *  - `visualIcon` — a Material Symbols icon name (e.g. `"campaign"`), or
   *  - `visualImage` — an image URL (rendered as `<img>`).
   * When either is set the visual is wrapped in a 12&nbsp;px-radius, stone-100
   * background frame per the design spec. If neither is set, the visual slot
   * is omitted entirely so the title sits flush against the left padding.
   */
  visualIcon?: string;
  visualImage?: string;
  /** Alt text for `visualImage`. Ignored when `visualIcon` is used. Defaults to `""` (decorative). */
  visualAlt?: string;
  button?: React.ReactElement<typeof Button>;
  onButtonClick?: () => void;
  className?: string;
}

const VISUAL_SIZE = 36;

const renderVisual = (
  visualIcon: BannerProps['visualIcon'],
  visualImage: BannerProps['visualImage'],
  visualAlt: BannerProps['visualAlt']
): React.ReactNode => {
  if (visualImage) {
    return (
      <img
        src={visualImage}
        alt={visualAlt ?? ''}
        className="banner__visual-image"
        width={VISUAL_SIZE}
        height={VISUAL_SIZE}
      />
    );
  }
  if (visualIcon) {
    return <Icon name={visualIcon} size={VISUAL_SIZE} />;
  }
  return null;
};

export const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  visualIcon,
  visualImage,
  visualAlt,
  button,
  onButtonClick,
  className = '',
}) => {
  const visual = renderVisual(visualIcon, visualImage, visualAlt);

  return (
    <div className={`banner ${className}`.trim()}>
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
