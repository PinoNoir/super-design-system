import React from 'react';
import Checkbox from '../checkbox/Checkbox';
import { TableSelectionCallback } from './types/data-table-generics';

export interface TableCheckboxProps<T> {
  checked: boolean;
  rowId: string;
  onSelectionChange: TableSelectionCallback<T>;
  disabled?: boolean;
  indeterminate?: boolean;
}

const TableCheckbox = <T,>({
  checked,
  rowId,
  onSelectionChange,
  disabled = false,
  indeterminate = false,
}: TableCheckboxProps<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onSelectionChange(rowId, event.target.checked, {
      source: 'checkbox',
    });
  };

  return (
    <Checkbox
      label="Select Row"
      hideLabel
      disabled={disabled}
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleChange}
    />
  );
};

export default TableCheckbox;
