import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { ListContext } from './ListContext';
import './List.css';
import type { ListItemProps } from './ListItem';

export interface ListProps {
  children: React.ReactNode;
  /**
   * Lets users reorder items: drag an item, or focus its handle, press Space to lift it, move it
   * with the arrow keys and press Space again to drop it (Escape puts it back).
   */
  draggable?: boolean;
  className?: string;
  /** Called with the item ids in their new order. */
  onReorder?: (order: string[]) => void;
  /** Accessible name of the list. */
  label?: string;
}

const getItemId = (child: React.ReactElement<ListItemProps>, fallback: string) => {
  return child.props.id ?? fallback;
};

const move = (order: string[], from: number, to: number) => {
  const next = [...order];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/** A vertical list of `ListItem`s, optionally reorderable by drag and drop or keyboard. */
export const List: React.FC<ListProps> = ({
  children,
  draggable = false,
  className = '',
  onReorder,
  label,
}) => {
  const items = useMemo(() => React.Children.toArray(children) as React.ReactElement<ListItemProps>[], [children]);
  const ids = items.map((child, index) => getItemId(child, `item-${index}`));
  const idsKey = ids.join('\u0000');

  const [order, setOrder] = useState<string[]>(ids);
  const [syncedKey, setSyncedKey] = useState(idsKey);
  const [lifted, setLifted] = useState<{ id: string; origin: string[] } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const offsets = useRef(new Map<string, number>());

  // Adopt the children's order when the items themselves change (added, removed or reordered
  // by the parent); otherwise keep the user's order across re-renders.
  if (idsKey !== syncedKey) {
    setSyncedKey(idsKey);
    setOrder(ids);
  }

  const commit = useCallback(
    (next: string[]) => {
      setOrder(next);
      onReorder?.(next);
    },
    [onReorder],
  );

  const onMove = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIndex = order.indexOf(sourceId);
    const targetIndex = order.indexOf(targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    commit(move(order, sourceIndex, targetIndex));
  };

  const position = (id: string, list = order) => `position ${list.indexOf(id) + 1} of ${list.length}`;

  const onHandleKey = (id: string, itemLabel: string, event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = order.indexOf(id);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (lifted?.id === id) {
        setLifted(null);
        setAnnouncement(`${itemLabel} dropped at ${position(id)}.`);
      } else {
        setLifted({ id, origin: order });
        setAnnouncement(`${itemLabel} lifted, ${position(id)}. Use the arrow keys to move it, Space to drop it, Escape to cancel.`);
      }
      return;
    }
    if (lifted?.id !== id) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setLifted(null);
      commit(lifted.origin);
      setAnnouncement(`Reordering cancelled. ${itemLabel} returned to ${position(id, lifted.origin)}.`);
      return;
    }
    const target = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: order.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    if (target < 0 || target >= order.length || target === index) return;
    const next = move(order, index, target);
    commit(next);
    setAnnouncement(`${itemLabel} moved to ${position(id, next)}.`);
  };

  const onHandleBlur = (id: string) => {
    if (lifted?.id === id) setLifted(null);
  };

  // FLIP: items that changed position slide from where they were (CSS sets the transition).
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const next = new Map<string, number>();
    list.querySelectorAll<HTMLElement>(':scope > [data-list-item-id]').forEach((element) => {
      const id = element.dataset.listItemId!;
      const top = element.offsetTop;
      next.set(id, top);
      const previous = offsets.current.get(id);
      if (previous === undefined || previous === top) return;
      element.style.transition = 'none';
      element.style.translate = `0 ${previous - top}px`;
      void element.offsetHeight;
      element.style.transition = '';
      element.style.translate = '';
    });
    offsets.current = next;
  }, [order]);

  const orderedItems = order
    .map((id) => items.find((child, index) => getItemId(child, `item-${index}`) === id))
    .filter(Boolean) as React.ReactElement<ListItemProps>[];

  return (
    <>
      <div ref={listRef} role="list" aria-label={label} className={`list ${className}`.trim()}>
        <ListContext.Provider value={{ draggable, onMove, order, liftedId: lifted?.id ?? null, onHandleKey, onHandleBlur }}>
          {orderedItems.map((child, index) =>
            React.cloneElement(child, {
              id: getItemId(child, `item-${index}`)
            })
          )}
        </ListContext.Provider>
      </div>
      {draggable && (
        <VisuallyHidden aria-live="assertive" aria-atomic="true">
          {announcement}
        </VisuallyHidden>
      )}
    </>
  );
};
