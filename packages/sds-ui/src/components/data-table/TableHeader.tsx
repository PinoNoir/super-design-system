import React from 'react';
import TableHead from './TableHead';
import { Icon } from '@iconify/react';
import { useId } from '../../utilities/use-id';
import { TableColumnProps, SortOrder } from './types/data-table-generics';
import styles from './styles/DataTable.module.css';
import { Checkbox } from '../checkbox';
import clsx from 'clsx';

type HTMLTableHeaderCellProps = Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'scope' | 'style' | 'onClick'>;

export interface TableHeaderProps<T> {
  /**
   * Specify the unique id for the TableHeader component
   */
  id?: string;
  /**
   * Optionally specify a custom CSS class for the TableHeader component
   */
  className?: string;
  /**
   * Specify the border radius of the TableHeader component
   */
  borderRadius?: 'none' | 'rounded';
  /**
   * Specify the columns for the TableHeader component
   */
  columns: TableColumnProps<T>[];
  /**
   * Specify the sort key of the column (eg. 'name', 'age', 'date' | this is a unique key for each column in the table)
   */
  sortKey?: string;
  /**
   * Specify the sort direction of the column (ascending, descending, none)
   */
  sortDirection?: SortOrder;
  /**
   * Specify the scope of the TableHeader cell
   */
  scope?: string;
  /**
   * Specify the colSpan of the TableHeader cell
   */
  colSpan?: number;
  /**
   * Specify whether a specific column is sortable, this will render a sort icon in the header
   */
  onSort?: (key: string) => void;
  /**
   * Specify the width of the TableHeader cell as a percentage
   */
  widthRef?: React.RefObject<HTMLTableCellElement>;
  /**
   * Enable select all checkbox functionality
   */
  enableSelectAll?: boolean;
  /**
   * Function to handle the select all checkbox
   */
  onSelectAll?: () => void;
  /**
   * Whether all selectable rows are selected
   */
  isAllSelected?: boolean;
  /**
   * Whether some (but not all) selectable rows are selected
   */
  isSomeSelected?: boolean;
  /**
   * Optional test ID for easier testing
   */
  'automation-id'?: string;
}

const TableHeader = <T,>({
  id,
  className,
  borderRadius,
  columns,
  colSpan,
  sortDirection,
  widthRef,
  onSort,
  sortKey,
  enableSelectAll = false,
  onSelectAll,
  isAllSelected = false,
  isSomeSelected = false,
  'automation-id': testId,
}: TableHeaderProps<T>): React.ReactElement => {
  const uniqueId = useId('table-sort');

  const headers = columns.map((column, index) => {
    const isCurrentSortColumn = sortKey === column.key;
    let iconState: SortOrder = 'none';

    if (isCurrentSortColumn) {
      iconState = sortDirection === 'ascending' || sortDirection === 'descending' ? sortDirection : 'none';
    }

    let headerContent: React.ReactNode;

    // Show select all checkbox in first column if enabled
    if (index === 0 && enableSelectAll) {
      const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Prevent event bubbling to avoid triggering sort
        event.stopPropagation();
        onSelectAll?.();
      };

      headerContent = (
        <Checkbox
          onChange={handleCheckboxChange}
          checked={isAllSelected}
          indeterminate={isSomeSelected && !isAllSelected}
          aria-describedby={uniqueId}
          automation-id="select-all-checkbox"
          label="Select all rows"
          hideLabel
        />
      );
    } else if (column.isSortable) {
      const handleSortClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onSort?.(column.key);
      };

      headerContent = (
        <button
          type="button"
          aria-describedby={uniqueId}
          onClick={handleSortClick}
          className={styles.sortButton}
          automation-id={testId ? `${testId}-sort-${column.key}` : undefined}
        >
          {column.header}
          <Icon className={styles.sortIcon} icon="mdi:menu-down" width="20px" data-state={iconState} />
        </button>
      );
    } else {
      headerContent = column.header;
    }

    const defaultScope = 'col';
    const thProps: HTMLTableHeaderCellProps = {};

    const headerClassName = clsx(styles.dataTableHeader, {
      [styles.rounded]: borderRadius === 'rounded',
      [styles.none]: borderRadius === 'none',
    });

    return (
      <th
        id={id}
        className={className}
        key={column.key}
        scope={defaultScope}
        ref={widthRef}
        style={{ width: index === 0 && enableSelectAll ? 20 : column.width }}
        colSpan={colSpan}
        automation-id={testId ? `${testId}-header-${column.key}` : undefined}
        {...thProps}
      >
        <div className={headerClassName}>{headerContent}</div>
      </th>
    );
  });

  return (
    <TableHead automation-id={testId}>
      <tr>{headers}</tr>
    </TableHead>
  );
};

TableHeader.displayName = 'TableHeader';

export default TableHeader;
