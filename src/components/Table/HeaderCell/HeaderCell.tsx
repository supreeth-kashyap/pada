import React, { useContext, useRef } from 'react';
import './HeaderCell.css';
import { TableContext } from '../Table';

export interface HeaderCellProps {
  columnId: string;
  label: string;
  className?: string;
}

export const HeaderCell: React.FC<HeaderCellProps> = ({ columnId, label, className = '' }) => {
  const context = useContext(TableContext);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeStart = (event: React.PointerEvent) => {
    if (!context) return;
    event.preventDefault();
    event.stopPropagation();
    startXRef.current = event.clientX;
    const column = context.columns.find((col) => col.id === columnId);
    startWidthRef.current = column?.width ?? 120;

    const handleMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startXRef.current;
      context.updateColumnWidth(columnId, startWidthRef.current + delta);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', columnId);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    context?.reorderColumns(sourceId, columnId);
  };

  return (
    <div
      className={`table-header-cell ${className}`.trim()}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <span className="table-header-cell__label">{label}</span>
      <span className="table-header-cell__resizer" onPointerDown={handleResizeStart} />
    </div>
  );
};
