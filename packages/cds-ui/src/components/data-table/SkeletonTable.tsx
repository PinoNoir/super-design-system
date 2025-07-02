import React from 'react';
import styles from './styles/SkeletonTable.module.css';
import { useId } from '../../utilities/use-id';
import clsx from 'clsx';

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  cellVariants?: ('text' | 'avatar' | 'badge' | 'number' | 'date')[];
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 10, 
  columns = 4, 
  className,
  cellVariants = ['text', 'text', 'badge', 'date'] // Default variants for each column
}) => {
  const baseId = useId();

  const renderCellContent = (colIndex: number) => {
    const variant = cellVariants[colIndex % cellVariants.length];
    
    switch (variant) {
      case 'avatar':
        return (
          <div className={styles.avatarCell}>
            <div className={styles.avatar} />
            <div className={styles.avatarText}>
              <div className={styles.primaryText} />
              <div className={styles.secondaryText} />
            </div>
          </div>
        );
      
      case 'badge':
        return <div className={styles.badge} />;
      
      case 'number':
        return <div className={styles.numberText} />;
      
      case 'date':
        return <div className={styles.dateText} />;
      
      case 'text':
      default:
        return (
          <div className={styles.textContent}>
            <div className={styles.primaryText} />
            {Math.random() > 0.5 && <div className={styles.secondaryText} />}
          </div>
        );
    }
  };

  return (
    <div className={clsx(styles.skeletonTable, className)}>
      <div className={styles.skeletonHeader}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={`${baseId}-header-${colIndex}`} className={clsx(styles.skeletonCell, styles.header)}>
            <div className={styles.headerText} />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`${baseId}-row-${rowIndex}`} className={styles.skeletonRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`${baseId}-cell-${rowIndex}-${colIndex}`} className={styles.skeletonCell}>
              {renderCellContent(colIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;