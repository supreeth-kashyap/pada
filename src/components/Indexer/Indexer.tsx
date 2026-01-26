import React, { useEffect, useRef, useState } from 'react';
import './Indexer.css';

export interface IndexerItem {
  id: string;
  label: string;
}

export interface IndexerProps extends React.HTMLAttributes<HTMLElement> {
  items: IndexerItem[];
  activeIndex?: number;
  offset?: number;
  onActiveChange?: (index: number) => void;
}

export const Indexer = ({
  items,
  activeIndex,
  offset,
  onActiveChange,
  className = '',
  ...props
}: IndexerProps) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const rafId = useRef<number | null>(null);
  const scrollLockRef = useRef(false);
  const scrollLockIndexRef = useRef<number | null>(null);
  const scrollLockTimeoutRef = useRef<number | null>(null);
  const currentIndex = activeIndex ?? internalActiveIndex;
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }

    const updateActiveIndex = () => {
      const threshold = typeof offset === 'number' ? offset : window.innerHeight * 0.35;
      const scrollPosition = window.scrollY + threshold;
      let nextIndex = 0;
      let hasTargets = false;

      items.forEach((item, index) => {
        const element = document.getElementById(item.id);
        if (!element) {
          return;
        }

        hasTargets = true;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPosition) {
          nextIndex = index;
        }
      });

      if (!hasTargets) {
        return;
      }

      if (scrollLockRef.current && scrollLockIndexRef.current !== null) {
        if (nextIndex !== scrollLockIndexRef.current) {
          return;
        }

        scrollLockRef.current = false;
        scrollLockIndexRef.current = null;
        if (scrollLockTimeoutRef.current !== null) {
          window.clearTimeout(scrollLockTimeoutRef.current);
          scrollLockTimeoutRef.current = null;
        }
      }

      const current = currentIndexRef.current;
      if (nextIndex === current) {
        return;
      }

      if (activeIndex === undefined) {
        setInternalActiveIndex(nextIndex);
      }

      if (onActiveChange) {
        onActiveChange(nextIndex);
      }
    };

    const handleScroll = () => {
      if (rafId.current !== null) {
        return;
      }

      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        updateActiveIndex();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateActiveIndex();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
      if (scrollLockTimeoutRef.current !== null) {
        window.clearTimeout(scrollLockTimeoutRef.current);
      }
    };
  }, [activeIndex, items, offset, onActiveChange]);

  const handleItemClick = (item: IndexerItem, index: number) => {
    const element = document.getElementById(item.id);
    if (element) {
      scrollLockRef.current = true;
      scrollLockIndexRef.current = index;
      if (scrollLockTimeoutRef.current !== null) {
        window.clearTimeout(scrollLockTimeoutRef.current);
      }
      scrollLockTimeoutRef.current = window.setTimeout(() => {
        scrollLockRef.current = false;
        scrollLockIndexRef.current = null;
        scrollLockTimeoutRef.current = null;
      }, 1200);
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    if (activeIndex === undefined) {
      setInternalActiveIndex(index);
    }

    if (onActiveChange) {
      onActiveChange(index);
    }
  };

  const classes = ['indexer', className].filter(Boolean).join(' ');

  return (
    <nav className={classes} {...props}>
      <ol className="indexer-list">
        {items.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <li className="indexer-list-item" key={item.id}>
              <button
                type="button"
                className={['indexer-item', isActive ? 'indexer-item--active' : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => handleItemClick(item, index)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
