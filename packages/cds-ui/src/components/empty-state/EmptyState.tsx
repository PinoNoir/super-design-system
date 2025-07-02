import { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import styles from './styles/EmptyState.module.css';
import { useId } from '../../utilities/use-id';
import Text from '../text/Text';

export interface EmptyStateProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * The title of the empty state.
   */
  title: string;

  /**
   * The description of the empty state.
   */
  description?: string;

  /**
   * Pass in children to the empty state. For example Buttons or Icons.
   */
  children?: React.ReactNode;

  /**
   * Set external styling to the empty state.
   */
  className?: string;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/**
 * Empty states provide a meaningful display or message
 * when there is no data or content to show in a particular section of the application.
 * For maximum usefulness, provide guidance or actions for users to populate the empty area.
 */
const EmptyState = ({ title, description, children, className, ...rest }: EmptyStateProps) => {
  const uniqueId = useId('empty-state');
  const baseStyles = clsx(styles.container, className);

  return (
    <div className={baseStyles} automation-id={uniqueId} role="status" {...rest}>
      <div className={styles.titleSection}>
        <Text as="h3">{title}</Text>
        {description && (
          <Text as="p" color="neutral80" weight="medium">
            {description}
          </Text>
        )}
      </div>
      {children && <div className={styles.actionButtons}>{children}</div>}
    </div>
  );
};

export default EmptyState;
