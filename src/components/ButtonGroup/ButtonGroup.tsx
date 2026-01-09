import React, { createContext, useContext, Fragment } from 'react';
import './ButtonGroup.css';
import { ButtonGroupItem, type ButtonGroupItemProps } from './ButtonGroupItem';
import { ButtonGroupSplitAction } from './ButtonGroupSplitAction';

export type ButtonGroupVariant = 'primary' | 'secondary';
export type ButtonGroupSize = 'sm' | 'md' | 'lg';

interface ButtonGroupContextValue {
  variant: ButtonGroupVariant;
  size: ButtonGroupSize;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export const useButtonGroupContext = () => {
  const context = useContext(ButtonGroupContext);
  return context;
};

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  items: ButtonGroupItemProps[];
}

export const ButtonGroup = ({
  variant = 'primary',
  size = 'md',
  items,
  className = '',
  ...props 
}: ButtonGroupProps) => {
  const groupClasses = [
    'button-group',
    `button-group--${variant}`,
    `button-group--${size}`,
    className
  ].filter(Boolean).join(' ');

  const contextValue: ButtonGroupContextValue = {
    variant,
    size
  };

  // Show max 3 items, overflow the rest if more than 3 items
  const maxVisibleItems = 3;
  const hasOverflow = items.length > maxVisibleItems;
  const visibleItems = hasOverflow ? items.slice(0, maxVisibleItems) : items;
  const overflowItems = hasOverflow ? items.slice(maxVisibleItems) : [];

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        className={groupClasses}
        role="group"
        {...props}
      >
        {visibleItems.map((item, index) => {
          const isLastVisible = index === visibleItems.length - 1;
          const shouldAttachSplitAction = hasOverflow && isLastVisible;
          
          if (shouldAttachSplitAction) {
            return (
              <React.Fragment key={index}>
                <ButtonGroupItem {...item} className={`${item.className || ''} button-group__item--before-split`.trim()} />
                <div className="button-group__split-action">
                  <div className="button-group__split-action-separator" />
                  <ButtonGroupSplitAction items={overflowItems} />
                </div>
              </React.Fragment>
            );
          }
          
          return <ButtonGroupItem key={index} {...item} />;
        })}
      </div>
    </ButtonGroupContext.Provider>
  );
};
