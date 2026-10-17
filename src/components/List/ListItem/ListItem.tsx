import React, { useContext, useId, useLayoutEffect, useRef } from 'react';
import './ListItem.css';
import { Icon } from '../../Icon';
import { ListContext } from '../ListContext';

export interface ListItemProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/** One row of a `List`. In a draggable list it gets a handle for mouse and keyboard reordering. */
export const ListItem: React.FC<ListItemProps> = ({ id, children, className = '' }) => {
  const context = useContext(ListContext);
  const draggable = context?.draggable ?? false;
  const lifted = !!id && context?.liftedId === id;
  const position = id ? (context?.order.indexOf(id) ?? -1) : -1;
  const handleRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleId = useId();
  const contentId = useId();

  // Moving the item re-inserts it in the DOM, which can drop focus; keep it on the handle.
  useLayoutEffect(() => {
    const handle = handleRef.current;
    if (lifted && handle && document.activeElement !== handle) handle.focus({ preventScroll: true });
  }, [lifted, position]);

  const handleDragStart = (event: React.DragEvent) => {
    if (!draggable || !id) return;
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    if (!draggable || !id) return;
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    context?.onMove(sourceId, id);
  };

  return (
    <div
      role="listitem"
      className={`list-item ${className}`.trim()}
      data-list-item-id={id}
      data-lifted={lifted ? '' : undefined}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={(event) => draggable && event.preventDefault()}
      onDrop={handleDrop}
    >
      {draggable && (
        <button
          ref={handleRef}
          id={handleId}
          type="button"
          className="list-item__drag"
          aria-label="Move"
          aria-labelledby={`${handleId} ${contentId}`}
          aria-pressed={lifted}
          onKeyDown={(event) => id && context?.onHandleKey(id, contentRef.current?.textContent?.trim() || 'Item', event)}
          onBlur={() => id && context?.onHandleBlur(id)}
        >
          <Icon name="drag_vertical" size={12} color="var(--pada-color-neutral-600)" />
        </button>
      )}
      <div ref={contentRef} id={contentId} className="list-item__content">
        {children}
      </div>
    </div>
  );
};
