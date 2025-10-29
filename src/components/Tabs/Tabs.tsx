import React, { useState, Children, isValidElement, cloneElement } from 'react';
import './Tabs.css';

interface TabsProps {
  children: React.ReactNode;
  label: string;
}

interface TabPanelProps {
  label: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tabs: React.FC<TabsProps> = ({ children, label }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Children.toArray(children).filter(isValidElement);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
      setActiveTab(nextIndex);
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs__list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            id={`tab-${index}`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            className={`tabs__tab ${activeTab === index ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={activeTab === index ? 0 : -1}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          id={`tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          className="tabs__panel"
          hidden={activeTab !== index}
        >
          {cloneElement(tab, { ...tab.props })}
        </div>
      ))}
    </div>
  );
};
