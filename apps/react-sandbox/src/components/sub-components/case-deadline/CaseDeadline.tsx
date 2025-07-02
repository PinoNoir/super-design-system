import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './CaseDeadline.module.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../../../api/mockApi';

type DeadlineStatus = 'pending' | 'completed' | 'overdue';

interface Deadline {
  id: string;
  status: DeadlineStatus;
  quantity: number;
}

interface DeadlineData {
  deadlines: Deadline[];
  descriptions: Record<string, string>;
}

interface CaseDeadlineProps extends ComponentPropsWithoutRef<'div'> {
  status: DeadlineStatus;
  quantity: number;
  description: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Presentation component for displaying a single deadline
 */
export const CaseDeadline: React.FC<CaseDeadlineProps> = ({
  status,
  quantity,
  description,
  className,
  onClick,
  ...props
}) => {
  const baseStyles = clsx(styles.base, styles[status], className);

  return (
    <div
      className={baseStyles}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      <div className={`${styles.quantity} ${styles[status]}`}>{quantity}</div>
      <div className={`${styles.description} ${styles[status]}`}>{description}</div>
    </div>
  );
};

/**
 * Container component that fetches and displays multiple deadlines
 */
export const DeadlinesContainer: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<DeadlineData, Error>({
    queryKey: ['deadlines'],
    queryFn: mockApi.getDeadlines,
    staleTime: 5 * 60 * 1000,
  });

  const updateDeadlineStatus = async (id: string, newStatus: DeadlineStatus) => {
    await mockApi.updateDeadlineStatus(id, newStatus);
    queryClient.invalidateQueries({ queryKey: ['deadlines'] });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading deadlines...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading deadlines: {error.message}</div>;
  }

  if (!data) {
    return <div className={styles.empty}>No deadlines available</div>;
  }

  return (
    <div className={styles.container}>
      {data.deadlines.map((deadline) => (
        <CaseDeadline
          key={deadline.id}
          status={deadline.status}
          quantity={deadline.quantity}
          description={data.descriptions[deadline.id] || 'No description'}
          onClick={() => {
            const newStatus: DeadlineStatus = deadline.status === 'pending' ? 'completed' : 'pending';
            updateDeadlineStatus(deadline.id, newStatus);
          }}
        />
      ))}
    </div>
  );
};
