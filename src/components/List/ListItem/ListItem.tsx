import React, { useContext } from 'react';
import './ListItem.css';
import { Icon } from '../../Icon';
import { ListContext } from '../List';

export interface ListItemProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ id, children, className = '' }) => {
  const context = useContext(ListContext);
  const draggable = context?.draggable ?? false;

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
      className={`list-item ${className}`.trim()}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={(event) => draggable && event.preventDefault()}
      onDrop={handleDrop}
    >
      {draggable && (
        <span className="list-item__drag">
          <Icon name="drag_vertical" size="xs" color="Icy" />
        </span>
      )}
      <div className="list-item__content">{children}</div>
    </div>
  );
};
