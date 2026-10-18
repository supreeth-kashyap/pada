import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import './HeaderCell.css';
import { TableContext } from '../TableContext';

export type SortDirection = 'ascending' | 'descending' | 'none';

export interface HeaderCellProps {
  columnId: string;
  label: string;
  className?: string;
  /** Current sort of this column. Set it (with `onSort`) to make the header a sort button. */
  sortDirection?: SortDirection;
  /** Called when the header is activated; flip `sortDirection` in response. */
  onSort?: () => void;
}

const RESIZE_STEP = 16;
const DEFAULT_MIN_WIDTH = 80;

/**
 * A column header (`role="columnheader"`). Drag it onto another header to reorder columns; drag
 * its right edge, or focus the edge and press Left/Right, to resize. With `onSort`, the label is
 * a button and the header reports `aria-sort`.
 */
export const HeaderCell: React.FC<HeaderCellProps> = ({ columnId, label, className = '', sortDirection, onSort }) => {
  const context = useContext(TableContext);
  const cellRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const column = context?.columns.find((col) => col.id === columnId);
  const minWidth = column?.minWidth ?? DEFAULT_MIN_WIDTH;
  const width = Math.round(column?.width ?? measuredWidth);

  // Columns without a set width are `1fr`; track the rendered width so resizing starts from it.
  useLayoutEffect(() => {
    const cell = cellRef.current;
    if (!cell) return;
    setMeasuredWidth(cell.offsetWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setMeasuredWidth(cell.offsetWidth));
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);

  const handleResizeStart = (event: React.PointerEvent) => {
    if (!context) return;
    event.preventDefault();
    event.stopPropagation();
    startXRef.current = event.clientX;
    startWidthRef.current = column?.width ?? cellRef.current?.offsetWidth ?? 120;

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

  const handleResizeKey = (event: React.KeyboardEvent) => {
    if (!context) return;
    const delta = { ArrowLeft: -RESIZE_STEP, ArrowRight: RESIZE_STEP }[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    context.updateColumnWidth(columnId, width + delta);
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
      ref={cellRef}
      role="columnheader"
      aria-sort={onSort ? (sortDirection ?? 'none') : undefined}
      data-sort={onSort ? (sortDirection ?? 'none') : undefined}
      className={`table-header-cell ${className}`.trim()}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      {onSort ? (
        <button type="button" className="table-header-cell__sort" onClick={onSort}>
          <span className="table-header-cell__label">{label}</span>
          <svg className="table-header-cell__sort-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span className="table-header-cell__label">{label}</span>
      )}
      {context && (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${label} column`}
          aria-valuenow={width}
          aria-valuemin={minWidth}
          tabIndex={0}
          className="table-header-cell__resizer"
          onPointerDown={handleResizeStart}
          onKeyDown={handleResizeKey}
          draggable={false}
        />
      )}
    </div>
  );
};
