import React from 'react';
import styles from './styles/List.module.css';
import { clsx } from 'clsx';

export interface ListItemProps extends React.ComponentPropsWithoutRef<'li'> {
  id?: string;
  className?: string;
  children: React.ReactNode;
  isDraggable?: boolean;
  onReorder?: (draggedId: string, droppedId: string) => void;
  ['automation-id']?: string;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
  const { id, className, children, isDraggable, onReorder, ...rest } = props;

  const [isDragging, setIsDragging] = React.useState(false);
  const uid = React.useId();
  const uniqueId = id || `list-item-${uid}`;

  const listItemClasses = clsx(
    styles.listItem,
    {
      [styles.dragging]: isDragging,
      [styles.draggable]: isDraggable,
    },
    className,
  );

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>) => {
    if (!isDraggable || !uniqueId) return;

    setIsDragging(true);
    event.dataTransfer.setData('text/plain', uniqueId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    if (!isDraggable) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLLIElement>) => {
    if (!isDraggable || !uniqueId) return;

    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text/plain');

    if (draggedId !== uniqueId && onReorder) {
      onReorder(draggedId, uniqueId);
    }
  };

  const handleDragEnd = () => {
    if (!isDraggable) return;
    setIsDragging(false);
  };

  return (
    <li
      ref={ref}
      className={listItemClasses}
      id={uniqueId}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      {...rest}
    >
      {children}
    </li>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
