import React from 'react';
import ListItem from './ListItem';
import ListItemActions from './ListItemActions'; // Fixed import name
import styles from './styles/List.module.css';
import ListItemForm from './ListItemForm';
import { clsx } from 'clsx';

export interface ListProps<T extends { id: string }> {
  /**
   * List of items to render
   */
  items: T[];
  /**
   * Function to render each item in the list
   */
  renderItem: (item: T) => React.ReactNode;

  /**
   * Allow control of the edit item id
   * This is useful for controlled components where the parent component manages the edit state
   * and the List component is used as a child component.
   * This is optional and if not provided, the List component will manage its own edit state
   * and the editItemId will be managed internally.
   */
  editingItemId?: string | null;

  /**
   * Function to call when an item is being edited
   */
  onEdit: (item: T) => void;
  /**
   * Function to call when an item is being saved
   */
  onSave: (item: T) => void;
  /**
   * Function to call when an item is being deleted
   */
  onDelete: (item: T) => void;
  /**
   * Function to render the edit inputs for an item
   * The handleChange function allows updating any field of the item type T
   */
  renderEditInputs: (item: T, handleChange: (field: keyof T, value: unknown) => void) => React.ReactNode;
  /**
   * Optional function to render additional content in the list item
   * This can be used to add custom actions or information
   */
  renderActions?: (item: T) => React.ReactNode;
  /**
   * Optional class name to apply to the list
   */
  className?: string;
  /**
   * optionally specify an automation id for testing
   */
  ['automation-id']?: string;
}

const List = <T extends { id: string }>({
  items,
  renderItem,
  editingItemId, // Use external control if provided
  onEdit,
  onSave,
  onDelete,
  renderEditInputs,
  renderActions,
  className,
  ...props
}: ListProps<T>) => {
  const [internalEditItemId, setInternalEditItemId] = React.useState<string | null>(null);

  // Use external editingItemId if provided, otherwise use internal state
  const editItemId = editingItemId ?? internalEditItemId;

  const handleEdit = (item: T) => {
    // Only set internal state if not controlled externally
    if (editingItemId === undefined) {
      setInternalEditItemId(item.id);
    }
    onEdit(item); // Always notify parent component
  };

  const handleSave = (item: T) => {
    onSave(item); // Let parent component handle the save operation
    // Only clear internal state if not controlled externally
    if (editingItemId === undefined) {
      setInternalEditItemId(null);
    }
  };

  const handleCancel = () => {
    // Only clear internal state if not controlled externally
    if (editingItemId === undefined) {
      setInternalEditItemId(null);
    }
  };

  return (
    <ul className={clsx(className, styles.list)} automation-id={props['automation-id'] || 'list'}>
      {items.map((item) => (
        <ListItem key={item.id}>
          {editItemId === item.id ? (
            <ListItemForm item={item} onSave={handleSave} onCancel={handleCancel} renderInputs={renderEditInputs} />
          ) : (
            <>
              {renderItem(item)}
              {renderActions ? (
                renderActions(item)
              ) : (
                <ListItemActions item={item} onEdit={handleEdit} onDelete={onDelete} />
              )}
            </>
          )}
        </ListItem>
      ))}
    </ul>
  );
};

export default List;
