import React from 'react';
import './KeyValue.css';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { Text } from '../Text';
import { TextWeight } from '../Text/helpers';

export interface KeyValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The key or label text displayed on the left side */
  label: string;
  /** The value displayed on the right side. Can be any React node, including other components */
  children: React.ReactNode;
  /** Optional tooltip content for the info icon. If not provided, info icon won't be shown */
  infoTooltip?: React.ReactNode;
  /** Optional custom label component. If provided, overrides the default Text component */
  labelComponent?: React.ReactNode;
}

export const KeyValue = ({
  label,
  children,
  infoTooltip,
  labelComponent,
  className = '',
  ...props
}: KeyValueProps) => {
  const classes = [
    'key-value',
    className
  ].filter(Boolean).join(' ');

  const renderLabel = () => {
    if (labelComponent) {
      return labelComponent;
    }
    return (
      <Text size="sm" weight={TextWeight.MEDIUM} color="var(--color-neutral-900)">
        {label}
      </Text>
    );
  };

  const renderInfoIcon = () => {
    if (!infoTooltip) {
      return null;
    }

    return (
      <Tooltip content={infoTooltip} position="top">
        <div className="key-value__info-icon-wrapper">
          <Icon 
            name="info" 
            size="xs" 
            color="Icy" 
            variant="outlined"
            className="key-value__info-icon"
          />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className={classes} {...props}>
      <div className="key-value__label-section">
        {renderLabel()}
        {renderInfoIcon()}
      </div>
      <div className="key-value__value-section">
        {children}
      </div>
    </div>
  );
};
