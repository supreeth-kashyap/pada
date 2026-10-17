import { useId, useState } from 'react';
import { useControllableState } from '../../headless/utils/useControllableState';
import './Rating.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface RatingProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  /** Show the rating without letting people change it; fractions (3.5) are drawn partly filled. */
  readOnly?: boolean;
  disabled?: boolean;
  /** Clicking the current rating again clears it. @default true */
  allowClear?: boolean;
  /** Visible label beside the stars, or hide it (it still names the control). @default true */
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Name for form submission. */
  name?: string;
  className?: string;
}

const Star = ({ fill }: { fill: number }) => (
  <svg viewBox="0 0 24 24" className="rating-star" aria-hidden="true" style={{ ['--pada-rating-fill' as string]: `${fill * 100}%` }}>
    <path className="rating-star-empty" d="M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z" />
    <path className="rating-star-full" d="M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z" />
  </svg>
);

/**
 * A star rating. Interactive ratings are a radio group (Tab in, arrow keys to change, and the
 * value submits with forms); hovering previews. Read-only ratings are a single image named
 * "4.5 out of 5 stars".
 */
export function Rating({
  label,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  disabled = false,
  allowClear = true,
  showLabel = true,
  size = 'md',
  name,
  className,
}: RatingProps) {
  const id = useId();
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  if (readOnly) {
    return (
      <span className={cx('rating', className)} data-size={size} data-readonly="">
        {showLabel && <span className="rating-label">{label}</span>}
        <span className="rating-stars" role="img" aria-label={`${showLabel ? '' : `${label}: `}${value} out of ${max} stars`}>
          {stars.map((star) => (
            <Star key={star} fill={Math.max(0, Math.min(1, value - star + 1))} />
          ))}
        </span>
      </span>
    );
  }

  return (
    <div className={cx('rating', className)} data-size={size} data-disabled={disabled ? '' : undefined}>
      <span id={`${id}-label`} className="rating-label" hidden={!showLabel}>
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="rating-stars" onPointerLeave={() => setHover(null)}>
        {stars.map((star) => (
          <label key={star} className="rating-option" data-filled={star <= shown ? '' : undefined} onPointerEnter={() => !disabled && setHover(star)}>
            <input
              type="radio"
              className="rating-input"
              name={name ?? `${id}rating`}
              value={star}
              checked={value === star}
              disabled={disabled}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
              onChange={() => setValue(star)}
              onClick={() => {
                if (allowClear && value === star) setValue(0);
              }}
            />
            <Star fill={star <= shown ? 1 : 0} />
          </label>
        ))}
      </div>
    </div>
  );
}
