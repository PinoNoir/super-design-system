import React, { ThHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import styles from './styles/DataTableHead.module.css';

export type TableHeadProps = ThHTMLAttributes<HTMLTableSectionElement>;

const TableHead = ({ children, ...props }: TableHeadProps): React.ReactElement => {
  const tableHeadClasses = clsx(styles.tableHead, props.className);

  return (
    <thead className={tableHeadClasses} {...props}>
      {children}
    </thead>
  );
};

TableHead.displayName = 'TableHead';

export default TableHead;
