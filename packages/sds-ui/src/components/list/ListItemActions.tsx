import React from 'react';
import { Icon } from '@iconify/react';
import styles from './styles/List.module.css';
import { IconButton } from '../icon-button';
import clsx from 'clsx';

export interface ListItemActionsProps<T> {
  /**
   * The item for which actions are being rendered.
   * This allows the component to be generic and reusable for different item types.
   */
  item: T;
  /**
   * Callback function to handle item editing.
   * The item is passed as an argument to allow custom edit logic.
   */
  onEdit?: (item: T) => void;
  /**
   * Callback function to handle item deletion.
   * The item is passed as an argument to allow custom deletion logic.
   */
  onDelete?: (item: T) => void;
  /**
   * Optional className for custom styling.
   * This allows users to apply additional styles to the action bar.
   */
  className?: string;
  /**
   * Custom content to render in the action bar.
   * When provided, this will replace the default edit/delete buttons.
   * The item is passed as a prop to allow custom actions.
   */
  children?: React.ReactNode | ((item: T) => React.ReactNode);
  /**
   * Additional actions to render before the default edit/delete buttons.
   * Useful for primary actions like view, favorite, or status toggles.
   */
  beforeActions?: React.ReactNode | ((item: T) => React.ReactNode);
  /**
   * Additional actions to render after the default edit/delete buttons.
   * Useful for secondary actions like share, archive, or more options.
   */
  afterActions?: React.ReactNode | ((item: T) => React.ReactNode);
  /**
   * Hide the default edit button
   */
  hideEdit?: boolean;
  /**
   * Hide the default delete button
   */
  hideDelete?: boolean;
  /**
   * Custom automation ID for testing
   */
  'automation-id'?: string;
}

const ListItemActions = <T,>({
  item,
  onEdit,
  onDelete,
  className,
  children,
  beforeActions,
  afterActions,
  hideEdit = false,
  hideDelete = false,
  ...props
}: ListItemActionsProps<T>) => {
  // Helper function to render content that can be either ReactNode or function
  const renderContent = (content: React.ReactNode | ((item: T) => React.ReactNode)) => {
    return typeof content === 'function' ? content(item) : content;
  };

  // If children is provided, render only the custom content
  if (children) {
    return (
      <div className={styles.actionBarWrapper} automation-id={props['automation-id']}>
        {renderContent(children)}
      </div>
    );
  }

  const actionBarClasses = clsx(styles.actionBarWrapper, className);

  // Render default layout with optional beforeActions/afterActions and conditional default buttons
  return (
    <div className={actionBarClasses} automation-id={props['automation-id']}>
      {beforeActions && renderContent(beforeActions)}

      {!hideEdit && onEdit && (
        <IconButton fill="none" onClick={() => onEdit(item)} aria-label="Edit item" automation-id="edit-button">
          <Icon icon="mdi:pencil" />
        </IconButton>
      )}

      {!hideDelete && onDelete && (
        <IconButton fill="none" onClick={() => onDelete(item)} aria-label="Delete item" automation-id="delete-button">
          <Icon icon="mdi:delete-forever" />
        </IconButton>
      )}

      {afterActions && renderContent(afterActions)}
    </div>
  );
};

ListItemActions.displayName = 'ListItemActions';

export default ListItemActions;
