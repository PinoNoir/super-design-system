import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import {
  TableColumnProps,
  SortOrder,
  ServerSideConfig,
  TableSelectionCallback,
  RowIdExtractor,
  RowDisabledPredicate,
  RowDraggablePredicate,
  defaultRowIdExtractor,
  createRowIdExtractor,
} from './types/data-table-generics';
import { useDragAndDrop } from '../../hooks';
import Loader from '../loader/Loader';
import Button from '../button/Button';
import TableHeader from './TableHeader';
import TableRows from './TableRows';
import Pagination from './TablePagination';
import styles from './styles/DataTable.module.css';

export interface TableProps<T> {
  // Core required props
  data: T[];
  columns: TableColumnProps<T>[];

  // Row identification strategy (flexible)
  rowKey?: keyof T;
  getRowId?: RowIdExtractor<T>;

  // Row state predicates (optional - user defines behavior)
  isRowDisabled?: RowDisabledPredicate<T>;
  isRowDraggable?: RowDraggablePredicate<T>;

  // Optional configuration
  id?: string;
  className?: string;
  borderRadius?: 'none' | 'rounded';
  rowHeight?: 'base' | 'condensed';

  // Sorting
  onSort?: (key: string) => void;
  sortDirection?: SortOrder;
  sortKey?: string;

  // Selection - simplified and consistent
  selectedRowIds?: string[];
  onSelectionChange?: TableSelectionCallback<T>;
  getIsRowSelected?: (rowId: string) => boolean; // Alternative for external state

  // Select All functionality
  enableSelectAll?: boolean;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: (shouldSelectAll: boolean, data: T[]) => void;

  // Pagination
  enablePagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Drag and Drop
  draggableRows?: boolean;
  onRowDragEnd?: (oldIndex: number, newIndex: number) => void;

  // Server-side features
  serverSide?: ServerSideConfig;

  // Advanced customization
  renderRow?: RowRenderer<T>;
  emptyState?: React.ReactNode;
  renderEmpty?: () => React.ReactNode;

  // Testing
  ['automation-id']?: string;
}

export type RowRenderer<T> = (
  rowData: T,
  index: number,
  options: {
    rowId: string;
    isSelected: boolean;
    isDisabled: boolean;
    isDraggable: boolean;
    rowClasses: string;
    defaultRowProps: DefaultRowProps<T>;
  },
) => React.ReactElement;

interface DefaultRowProps<T> {
  rowId: string;
  data: T;
  columns: TableColumnProps<T>[];
  isDisabled: boolean;
  isSelected: boolean;
  onSelectionChange?: TableSelectionCallback<T>;
  onClick?: () => void;
  isDraggable: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
  className: string;
  rowHeight?: 'base' | 'condensed';
}

const Table = <T,>({
  // Core props
  data,
  columns,

  // Row identification
  rowKey,
  getRowId,

  // Row state predicates
  isRowDisabled,
  isRowDraggable,

  // Optional props with defaults
  id,
  className,
  borderRadius = 'none',
  rowHeight = 'base',

  // Sorting
  onSort,
  sortDirection,
  sortKey,

  // Selection - simplified
  selectedRowIds = [],
  onSelectionChange,
  getIsRowSelected,

  // Select All
  enableSelectAll = false,
  isAllSelected = false,
  isSomeSelected = false,
  onSelectAll,

  // Pagination
  enablePagination = false,
  currentPage,
  pageSize,
  totalItems,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,

  // Drag and Drop
  draggableRows = false,
  onRowDragEnd,

  // Server-side
  serverSide,

  // Advanced
  renderRow,
  emptyState,
  renderEmpty,

  // Testing
  'automation-id': automationId,
}: TableProps<T>): React.ReactElement => {
  const tableRef = React.useRef<HTMLTableElement>(null);
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);

  // Create row ID extractor based on props
  const rowIdExtractor = useMemo((): RowIdExtractor<T> => {
    if (getRowId) return getRowId;
    if (rowKey) return createRowIdExtractor(rowKey);
    return defaultRowIdExtractor;
  }, [getRowId, rowKey]);

  // Internal pagination state (used when not controlled externally)
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);

  // Drag and drop state
  const {
    draggedIndex,
    draggedOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd: hookHandleDragEnd,
  } = useDragAndDrop<T>();

  // Determine active pagination values (controlled vs uncontrolled)
  const activePage = currentPage ?? internalPage;
  const activePageSize = pageSize ?? internalPageSize;
  const activeTotalItems = totalItems ?? data.length;
  const totalPages = Math.ceil(activeTotalItems / activePageSize);

  // Pagination handlers
  const handlePageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
      if (onPageChange) {
        Promise.resolve(onPageChange(page));
      } else {
        setInternalPage(page);
      }
    },
    [onPageChange],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (onPageSizeChange) {
        Promise.resolve(onPageSizeChange(size));
      } else {
        setInternalPageSize(size);
        setInternalPage(1);
      }
    },
    [onPageSizeChange],
  );

  // Flexible row state determination
  const determineRowState = useCallback(
    (rowData: T, index: number) => {
      const rowId = rowIdExtractor(rowData, index);

      // Determine if row is selected (multiple strategies)
      let selected = false;
      if (getIsRowSelected) {
        selected = getIsRowSelected(rowId);
      } else if (selectedRowIds.length > 0) {
        selected = selectedRowIds.includes(rowId);
      } else {
        // Fallback: check if data has selected property (backward compatibility)
        const hasSelected = typeof rowData === 'object' && rowData !== null && 'selected' in rowData;
        selected = hasSelected ? Boolean((rowData as any).selected) : false;
      }

      // Determine if row is disabled
      let disabled = false;
      if (isRowDisabled) {
        disabled = isRowDisabled(rowData, index);
      } else {
        // Fallback: check if data has disabled property (backward compatibility)
        const hasDisabled = typeof rowData === 'object' && rowData !== null && 'disabled' in rowData;
        disabled = hasDisabled ? Boolean((rowData as any).disabled) : false;
      }

      // Determine if row is draggable
      let isDraggable = draggableRows;
      if (isRowDraggable) {
        isDraggable = isRowDraggable(rowData, index);
      }

      return {
        rowId,
        isSelected: selected,
        isDisabled: disabled,
        isDraggable,
      };
    },
    [rowIdExtractor, getIsRowSelected, selectedRowIds, isRowDisabled, isRowDraggable, draggableRows],
  );

  // Drag and drop handler
  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && draggedOverIndex !== null && draggedIndex !== draggedOverIndex) {
      onRowDragEnd?.(draggedIndex, draggedOverIndex);
    }
    hookHandleDragEnd();
  }, [draggedIndex, draggedOverIndex, onRowDragEnd, hookHandleDragEnd]);

  // Add drag handle column if draggable
  const columnsWithDragHandle = useMemo(
    () =>
      draggableRows
        ? [
            {
              key: 'dragRow',
              header: '',
              isSortable: false,
              width: 40,
              render: () => <Icon icon="mdi:drag-vertical" style={{ cursor: 'grab' }} />,
            },
            ...columns,
          ]
        : columns,
    [draggableRows, columns],
  );

  // Handle select all click
  const handleSelectAllClick = useCallback(() => {
    if (onSelectAll) {
      const shouldSelectAll = !isAllSelected;
      onSelectAll(shouldSelectAll, data);
    }
  }, [onSelectAll, isAllSelected, data]);

  // Helper to create row props
  const createDefaultRowProps = useCallback(
    (rowData: T, index: number): DefaultRowProps<T> => {
      const { rowId, isSelected, isDisabled, isDraggable } = determineRowState(rowData, index);

      const rowClasses = clsx({
        [styles.dragging]: draggedIndex === index,
        [styles.dragOver]: draggedOverIndex === index && draggedIndex !== index,
      });

      return {
        rowId,
        data: rowData,
        columns: columnsWithDragHandle,
        isDisabled,
        isSelected,
        onSelectionChange,
        onClick: undefined, // Let TableRows handle its own click logic
        isDraggable,
        onDragStart: isDraggable
          ? (event: React.DragEvent<HTMLElement>) => handleDragStart(event, rowData, index)
          : undefined,
        onDragOver: isDraggable
          ? (event: React.DragEvent<HTMLElement>) => handleDragOver(event, rowData, index)
          : undefined,
        onDragEnd: isDraggable ? handleDragEnd : undefined,
        className: rowClasses,
        rowHeight,
      };
    },
    [
      determineRowState,
      draggedIndex,
      draggedOverIndex,
      onSelectionChange,
      columnsWithDragHandle,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      rowHeight,
    ],
  );

  // Render table body with loading, error, and data states
  const renderTableBody = useCallback(() => {
    const totalColumns = columnsWithDragHandle.length;

    // Loading state
    if (serverSide?.isLoading) {
      return (
        <tr>
          <td colSpan={totalColumns} className={styles.loaderCell}>
            <Loader />
          </td>
        </tr>
      );
    }

    // Error state
    if (serverSide?.error) {
      return (
        <tr>
          <td colSpan={totalColumns} className={styles.errorCell}>
            <div className={styles.errorMessageContainer}>
              <div className={styles.errorMessageContent}>
                <Icon icon="mdi:alert-rhombus" width="24px" color="var(--theme-icon-error)" />
                <p className={styles.errorMessage}>{serverSide.error}</p>
              </div>
              {serverSide.onRetry && (
                <Button variant="primary" onClick={serverSide.onRetry} disabled={serverSide.isLoading}>
                  Retry
                </Button>
              )}
            </div>
          </td>
        </tr>
      );
    }

    // Empty state
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={totalColumns} className={styles.emptyCell}>
            {renderEmpty ? (
              renderEmpty()
            ) : emptyState ? (
              emptyState
            ) : (
              <div className={styles.emptyMessageContainer}>
                <Icon icon="mdi:database-outline" width="24px" color="var(--theme-icon-muted)" />
                <p className={styles.emptyMessage}>No data available</p>
              </div>
            )}
          </td>
        </tr>
      );
    }

    // Data rows
    return data.map((rowData, index) => {
      const defaultRowProps = createDefaultRowProps(rowData, index);
      const { rowId, isSelected, isDisabled, isDraggable } = determineRowState(rowData, index);

      // Custom row renderer if provided
      if (renderRow) {
        return renderRow(rowData, index, {
          rowId,
          isSelected,
          isDisabled,
          isDraggable,
          rowClasses: defaultRowProps.className,
          defaultRowProps,
        });
      }

      // Default row renderer
      return <TableRows key={rowId} {...defaultRowProps} />;
    });
  }, [
    serverSide,
    columnsWithDragHandle,
    data,
    createDefaultRowProps,
    determineRowState,
    renderRow,
    emptyState,
    renderEmpty,
  ]);

  // Don't render pagination if disabled or no data in server-side mode
  const shouldShowPagination = enablePagination && (!serverSide?.enabled || activeTotalItems > 0);

  // Table styling
  const containerClasses = clsx(styles.tableContainer, {
    [styles.none]: borderRadius === 'none',
    [styles.rounded]: borderRadius === 'rounded',
  });

  const baseStyles = clsx(styles.dataTable, className, {
    [styles.rounded]: borderRadius === 'rounded',
    [styles.none]: borderRadius === 'none',
  });

  return (
    <div className={containerClasses} automation-id={automationId}>
      <div className={styles.content}>
        <table id={id} ref={tableRef} className={baseStyles} role="table" aria-label="Data table">
          <TableHeader
            columns={columnsWithDragHandle}
            onSort={onSort}
            sortDirection={sortDirection}
            sortKey={sortKey}
            enableSelectAll={enableSelectAll}
            onSelectAll={handleSelectAllClick}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
          />
          <tbody ref={tableBodyRef}>{renderTableBody()}</tbody>
        </table>
      </div>

      {shouldShowPagination && (
        <Pagination
          currentPage={activePage}
          pageSize={activePageSize}
          totalPages={totalPages}
          totalItems={activeTotalItems}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={serverSide?.isLoading}
          itemDescription={serverSide?.itemDescription}
          pageInfoText={serverSide?.pageInfoText}
          serverSide={serverSide?.enabled}
        />
      )}
    </div>
  );
};

Table.displayName = 'Table';

export default Table;
