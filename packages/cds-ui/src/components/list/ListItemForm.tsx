import React from 'react';
import { Button } from '../button';
import styles from './styles/List.module.css';

export interface ListItemFormProps<T> {
  item: T;
  onSave: (item: T) => void;
  onCancel: () => void;
  renderInputs: (
    item: T,
    handleChange: (field: keyof T, value: unknown) => void,
    errors?: Record<string, string>,
  ) => React.ReactNode;
  validate?: (item: T) => Record<string, string>;
  saveLabel?: string;
  cancelLabel?: string;
  ['automation-id']?: string;
}

const ListItemForm = <T extends Record<string, unknown>>({
  item,
  onSave,
  onCancel,
  renderInputs,
  validate,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  ...props
}: ListItemFormProps<T>) => {
  const [editedItem, setEditedItem] = React.useState<T>(item);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset form when item prop changes
  React.useEffect(() => {
    setEditedItem(item);
    setErrors({});
  }, [item]);

  const handleInputChange = (field: keyof T, value: unknown) => {
    setEditedItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));

    // Clear error for this field when it changes
    if (errors[field as string]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field as string];
        return updated;
      });
    }
  };

  const handleSave = () => {
    if (validate) {
      const validationErrors = validate(editedItem);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    onSave(editedItem);
  };

  const handleReset = () => {
    setEditedItem(item);
    setErrors({});
  };

  return (
    <form
      className={styles.listItemForm}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      automation-id={props['automation-id'] || 'list-item-form'}
    >
      {renderInputs(editedItem, handleInputChange, errors)}
      <div className={styles.listItemFormButtons}>
        <Button size="small" variant="primary" onClick={handleSave} type="button" automation-id="save-button">
          {saveLabel}
        </Button>
        <Button size="small" variant="secondary" onClick={onCancel} type="button" automation-id="cancel-button">
          {cancelLabel}
        </Button>
        {JSON.stringify(item) !== JSON.stringify(editedItem) && (
          <Button size="small" variant="tertiary" onClick={handleReset} type="button" automation-id="reset-button">
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};

export default ListItemForm;
