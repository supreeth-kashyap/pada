import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PageHeader.css';
import { Icon } from '../Icon';
import { Button } from '../Button';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onCommandClick?: () => void;
  commandLabel?: string;
  commandShortcut?: string;
  onAiClick?: () => void;
  aiLabel?: string;
  profileTrigger?: React.ReactNode;
  profileMenu?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  onCommandClick,
  commandLabel = 'Search',
  commandShortcut = '⌘+K',
  onAiClick,
  aiLabel = 'AI',
  profileTrigger,
  profileMenu,
  className = ''
}) => {
  const [crumbsOpen, setCrumbsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const crumbsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { visibleCrumbs, hiddenCrumbs } = useMemo(() => {
    if (breadcrumbs.length <= 3) {
      return { visibleCrumbs: breadcrumbs, hiddenCrumbs: [] };
    }
    return {
      visibleCrumbs: [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]],
      hiddenCrumbs: breadcrumbs.slice(1, -1)
    };
  }, [breadcrumbs]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (crumbsRef.current && !crumbsRef.current.contains(event.target as Node)) {
        setCrumbsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const renderCrumb = (crumb: BreadcrumbItem, isActive: boolean) => {
    const content = (
      <span className={`page-header__crumb ${isActive ? 'page-header__crumb--active' : ''}`}>
        {crumb.label}
      </span>
    );
    if (crumb.href) {
      return (
        <a className="page-header__crumb-link" href={crumb.href}>
          {content}
        </a>
      );
    }
    if (crumb.onClick) {
      return (
        <button type="button" className="page-header__crumb-link" onClick={crumb.onClick}>
          {content}
        </button>
      );
    }
    return content;
  };

  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header__breadcrumbs">
        {breadcrumbs.length <= 3 && breadcrumbs.map((crumb, index) => (
          <div key={`${crumb.label}-${index}`} className="page-header__crumb-item">
            {renderCrumb(crumb, index === breadcrumbs.length - 1)}
            {index < breadcrumbs.length - 1 && <span className="page-header__separator">/</span>}
          </div>
        ))}

        {breadcrumbs.length > 3 && (
          <>
            <div className="page-header__crumb-item">
              {renderCrumb(visibleCrumbs[0], false)}
              <span className="page-header__separator">/</span>
            </div>
            <div className="page-header__crumb-item page-header__crumb-ellipsis" ref={crumbsRef}>
              <button
                type="button"
                className="page-header__ellipsis-button"
                onClick={() => setCrumbsOpen((prev) => !prev)}
              >
                ...
              </button>
              <span className="page-header__separator">/</span>
              {crumbsOpen && (
                <div className="page-header__crumb-dropdown">
                  {hiddenCrumbs.map((crumb, index) => (
                    <button
                      key={`${crumb.label}-${index}`}
                      type="button"
                      className="page-header__crumb-dropdown-item"
                      onClick={() => {
                        crumb.onClick?.();
                        if (crumb.href) window.location.href = crumb.href;
                        setCrumbsOpen(false);
                      }}
                    >
                      {crumb.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="page-header__crumb-item">
              {renderCrumb(visibleCrumbs[1], true)}
            </div>
          </>
        )}
      </div>

      <div className="page-header__actions">
        <button type="button" className="page-header__command" onClick={onCommandClick}>
          <span className="page-header__command-left">
            <Icon name="search" size={12} color="var(--color-neutral-600)" />
            <span className="page-header__command-text">{commandLabel}</span>
          </span>
          <span className="page-header__command-shortcut">{commandShortcut}</span>
        </button>

        <button type="button" className="page-header__ai" onClick={onAiClick}>
          <span className="page-header__ai-label">{aiLabel}</span>
        </button>

        <div className="page-header__profile" ref={profileRef}>
          <button
            type="button"
            className="page-header__profile-trigger"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            {profileTrigger ?? <Icon name="user_default" size={12} color="var(--color-neutral-600)" />}
          </button>
          {profileOpen && profileMenu && (
            <div className="page-header__profile-menu">
              {profileMenu}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
