import React, { useEffect, useId, useState } from 'react';
import './Tooltip.css';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  // WAI-ARIA APG tooltip: Escape dismisses without moving focus.
  useEffect(() => {
    if (!visible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible]);

  // The tooltip stays in the DOM (hidden) so the trigger's aria-describedby
  // always resolves; any description the child already has is kept.
  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  const describedBy = [child.props['aria-describedby'], tooltipId].filter(Boolean).join(' ');

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {React.cloneElement(child, { 'aria-describedby': describedBy })}
      <div
        id={tooltipId}
        role="tooltip"
        className={`tooltip tooltip--${position}`}
        hidden={!visible}
      >
        {content}
      </div>
    </div>
  );
};
