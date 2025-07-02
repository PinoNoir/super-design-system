import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styles from './WidgetContainer.module.css';

type WidgetContainerProps = {
  id: string;
  children: React.ReactNode;
  isEmpty?: boolean;
};

const WidgetContainer: React.FC<WidgetContainerProps> = ({ id, children, isEmpty = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className={styles.wrapper}>
      <div ref={setNodeRef} className={`${styles.widgetContainer} ${isOver ? styles.isOver : ''}`}>
        {children}
        {isEmpty && <div className={styles.emptyPlaceholder}>Drag items here</div>}
      </div>
    </div>
  );
};

export default WidgetContainer;
