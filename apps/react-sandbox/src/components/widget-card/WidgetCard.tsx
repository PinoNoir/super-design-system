import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Card } from '@stretto/cds-ui';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';
import styles from './WidgetCard.module.css';

export type WidgetType = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type WidgetCardProps = {
  widget: WidgetType;
};

const WidgetCard: React.FC<WidgetCardProps> = ({ widget }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div className={styles.widgetWrapper}>
      <Card ref={setNodeRef} style={style} className={`${isDragging ? styles.dragging : ''}`}>
        <div className={styles.dragHeader} {...attributes} {...listeners}>
          <Icon icon="material-symbols:drag-indicator" width="24px" />
          <Card.Title>{widget.title}</Card.Title>
        </div>
        <Card.Content>{widget.content}</Card.Content>
      </Card>
    </div>
  );
};

export default WidgetCard;
