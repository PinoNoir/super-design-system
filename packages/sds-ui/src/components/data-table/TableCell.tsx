import React from 'react';
import { clsx } from 'clsx';
import { useId } from '../../utilities/use-id';
import styles from './styles/DataTable.module.css';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Specify the unique id for the TableCell component
   */
  id?: string;
  /**
   * Optionally specify a custom CSS class for the TableCell component
   */
  className?: string;

  /**
   * Specify the children of the TableCell component
   */
  children?: React.ReactNode;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ id, className, children, ...props }, forwardedRef) => {
    const uid = useId('cell');
    const uniqueId = id || uid;
    const cellStyles = clsx(styles.dataTableCell, className);
    return (
      <td ref={forwardedRef} id={uniqueId} className={cellStyles} {...props}>
        {children}
      </td>
    );
  },
);

TableCell.displayName = 'TableCell';

export default TableCell;
