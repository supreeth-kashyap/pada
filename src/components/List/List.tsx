import React, { createContext, useEffect, useMemo, useState } from 'react';
import './List.css';
import type { ListItemProps } from './ListItem';

interface ListContextValue {
  draggable: boolean;
  onMove: (sourceId: string, targetId: string) => void;
}

export const ListContext = createContext<ListContextValue | null>(null);

export interface ListProps {
  children: React.ReactNode;
  draggable?: boolean;
  className?: string;
  onReorder?: (order: string[]) => void;
}

const getItemId = (child: React.ReactElement<ListItemProps>, fallback: string) => {
  return child.props.id ?? fallback;
};

export const List: React.FC<ListProps> = ({
  children,
  draggable = false,
  className = '',
  onReorder
}) => {
  const items = useMemo(() => React.Children.toArray(children) as React.ReactElement<ListItemProps>[], [children]);
  const [order, setOrder] = useState<string[]>(() =>
    items.map((child, index) => getItemId(child, `item-${index}`))
  );

  useEffect(() => {
    setOrder(items.map((child, index) => getItemId(child, `item-${index}`)));
  }, [items]);

  const onMove = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setOrder((prev) => {
      const sourceIndex = prev.indexOf(sourceId);
      const targetIndex = prev.indexOf(targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      onReorder?.(next);
      return next;
    });
  };

  const orderedItems = order
    .map((id) => items.find((child, index) => getItemId(child, `item-${index}`) === id))
    .filter(Boolean) as React.ReactElement<ListItemProps>[];

  return (
    <div className={`list ${className}`.trim()}>
      <ListContext.Provider value={{ draggable, onMove }}>
        {orderedItems.map((child, index) =>
          React.cloneElement(child, {
            id: getItemId(child, `item-${index}`)
          })
        )}
      </ListContext.Provider>
    </div>
  );
};
