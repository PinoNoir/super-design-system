import React from 'react';
import Button from '../button/Button';
import { TableSelectionCallback } from './types/data-table-generics';

export interface TableButtonProps<T> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'base' | 'accent' | 'danger';
  disabled?: boolean;
  rowId: string;
  isSelected: boolean;
  onSelectionChange: TableSelectionCallback<T>;
  onClick?: (event: React.MouseEvent) => void;
}

const TableButton = <T,>({
  children,
  variant = 'primary',
  disabled = false,
  rowId,
  isSelected,
  onSelectionChange,
  onClick,
  ...props
}: TableButtonProps<T>) => {
  const handleClick = (event: React.MouseEvent) => {
    // Prevent event bubbling to avoid row click conflicts
    event.stopPropagation();

    // Handle custom onClick first if provided
    if (onClick) {
      onClick(event);
    }

    // Toggle selection state - no rowData needed
    const newSelectionState = !isSelected;
    onSelectionChange(rowId, newSelectionState, {
      source: 'button',
    });
  };

  return (
    <Button {...props} variant={variant} size="small" disabled={disabled} onClick={handleClick}>
      {children || (isSelected ? 'Selected' : 'Select')}
    </Button>
  );
};

TableButton.displayName = 'TableButton';

export default TableButton;
