import React, { useState, Children, isValidElement, cloneElement } from 'react';
import './Tabs.css';

interface TabsProps {
  children: React.ReactNode;
  label: string;
  /** Initial active index in uncontrolled mode. Ignored when `value` is set. */
  defaultValue?: number;
  /** Controlled active index. */
  value?: number;
  /** Fires whenever the active tab changes. */
  onChange?: (index: number) => void;
}

interface TabPanelProps {
  label: string;
  children: React.ReactNode;
  /**
   * When `true`, renders a small red notification dot next to the tab's label
   * to signal that this section has new / unread content.
   */
  notification?: boolean;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tabs: React.FC<TabsProps> = ({
  children,
  label,
  defaultValue = 0,
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;
  const [internalActive, setInternalActive] = useState(defaultValue);
  const activeTab = isControlled ? value : internalActive;
  const tabs = Children.toArray(children).filter(isValidElement) as React.ReactElement<TabPanelProps>[];

  const setActive = (index: number) => {
    if (!isControlled) setInternalActive(index);
    onChange?.(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== -1) {
      const nextTab = document.getElementById(`tab-${nextIndex}`);
      nextTab?.focus();
      setActive(nextIndex);
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs__list">
        {tabs.map((tab, index) => {
          const tabProps = tab.props as TabPanelProps;
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              id={`tab-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${index}`}
              className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
              onClick={() => setActive(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="tabs__tab-label">{tabProps.label}</span>
              {tabProps.notification && (
                <span
                  className="tabs__tab-indicator"
                  aria-label="Unread updates"
                  role="status"
                />
              )}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => {
        const tabProps = tab.props as TabPanelProps;
        return (
          <div
            key={index}
            id={`tabpanel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            className="tabs__panel"
            hidden={activeTab !== index}
          >
            {cloneElement(tab, { ...tabProps })}
          </div>
        );
      })}
    </div>
  );
};
