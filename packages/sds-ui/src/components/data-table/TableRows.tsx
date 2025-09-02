import React from 'react';
import { TableColumnProps, TableSelectionCallback } from './types/data-table-generics';
import TableCell from './TableCell';
import styles from './styles/DataTableRows.module.css';
import { clsx } from 'clsx';

export interface TableRowsProps<T> {
  /** Specify a unique id for the row - now required from parent */
  rowId: string;

  /** Specify a custom style to be applied to the row */
  style?: React.CSSProperties;

  /** Specify a custom class to be applied to the row */
  className?: string;

  /** The data for the row */
  data: T;

  /** The columns for the row */
  columns: TableColumnProps<T>[];

  /** Whether the row is selected */
  isSelected?: boolean;

  /** Whether the row is disabled */
  isDisabled?: boolean;

  /** Whether the row is sortable */
  isSortable?: boolean;

  /** Whether the row is draggable */
  isDraggable?: boolean;

  /** The height of rows in the `Table` - converted to CSS classes, not passed to DOM */
  rowHeight?: 'base' | 'condensed';

  /** Whether the row is collapsible */
  collapsibleContent?: React.ReactNode;

  /** Provide an optional onClick handler that is called on click */
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;

  /** Standardized selection callback */
  onSelectionChange?: TableSelectionCallback<T>;

  /** Callback when the row is dragged */
  onDragStart?: (event: React.DragEvent<HTMLTableRowElement>) => void;

  /** Callback when the row is dragged over */
  onDragOver?: (event: React.DragEvent<HTMLTableRowElement>) => void;

  /** Callback when the row drag ends */
  onDragEnd?: (event: React.DragEvent<HTMLTableRowElement>) => void;

  /** Row index for context (used by column render functions) */
  rowIndex?: number;

  /** Optional test ID for easier testing */
  'automation-id'?: string;
}

const TableRows = <T,>({
  rowId,
  style,
  className,
  data,
  columns,
  isSortable,
  isSelected = false,
  isDisabled = false,
  onSelectionChange,
  onClick,
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDragEnd,
  collapsibleContent,
  rowHeight = 'base',
  rowIndex = 0,
}: TableRowsProps<T>) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Handle row selection
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      // Don't handle clicks if row is disabled
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      // Handle collapsible content first (highest priority)
      if (collapsibleContent) {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        return; // Don't trigger other click handlers
      }

      // Handle custom onClick (but don't stop propagation - let parent handle row selection)
      if (onClick) {
        onClick(e);
        // Don't return here - still allow selection to happen
      }

      // Handle row selection - pass the NEW desired selection state
      if (onSelectionChange) {
        const newSelectionState = !isSelected;
        onSelectionChange(rowId, newSelectionState, {
          source: 'row',
        });
      }
    },
    [isDisabled, collapsibleContent, isExpanded, onClick, onSelectionChange, rowId, isSelected],
  );

  const handleDragStart = React.useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      setIsDragging(true);
      if (onDragStart) {
        onDragStart(event);
      }
    },
    [isDisabled, onDragStart],
  );

  const handleDragEnd = React.useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      setIsDragging(false);
      if (onDragEnd) {
        onDragEnd(event);
      }
    },
    [onDragEnd],
  );

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      if (onDragOver) {
        onDragOver(event);
      }
    },
    [isDisabled, onDragOver],
  );

  // Handle keyboard interaction for accessibility
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (isDisabled) return;

      // Handle Enter or Space for row selection
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        // Handle collapsible content
        if (collapsibleContent) {
          setIsExpanded(!isExpanded);
          return;
        }

        // Handle row selection
        if (onSelectionChange) {
          const newSelectionState = !isSelected;
          onSelectionChange(rowId, newSelectionState, {
            source: 'keyboard',
          });
        }
      }
    },
    [isDisabled, collapsibleContent, isExpanded, onSelectionChange, rowId, isSelected],
  );

  // Convert rowHeight prop to CSS classes (not passed to DOM element)
  const rowStyles = clsx(styles.dataTableRow, className, {
    [styles.selected]: isSelected,
    [styles.disabled]: isDisabled,
    [styles.draggable]: isDraggable && !isDisabled,
    [styles.dragging]: isDragging,
    [styles.expanded]: isExpanded,
    [styles.collapsibleRow]: !!collapsibleContent,
    [styles.base]: rowHeight === 'base',
    [styles.condensed]: rowHeight === 'condensed',
    [styles.clickable]: (onSelectionChange || onClick || collapsibleContent) && !isDisabled,
  });

  return (
    <>
      <tr
        id={rowId}
        className={rowStyles}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        draggable={isDraggable && !isDisabled}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        style={style}
        automation-id="table-row"
        tabIndex={!isDisabled && (onSelectionChange || onClick || collapsibleContent) ? 0 : -1}
        role="row"
        aria-selected={onSelectionChange ? isSelected : undefined}
        aria-disabled={isDisabled}
        aria-expanded={collapsibleContent ? isExpanded : undefined}
      >
        {columns.map((column, columnIndex) => {
          const cellKey = `${rowId}-${column.id || column.key || columnIndex}`;

          return (
            <TableCell key={cellKey}>
              {column.render?.(data, {
                isSelected,
                isRowDisabled: isDisabled,
                isRowDraggable: isDraggable,
                isSortable: isSortable ?? false,
                rowIndex: rowIndex,
                rowId,
              })}
            </TableCell>
          );
        })}
      </tr>
      {isExpanded && collapsibleContent && (
        <tr className={styles.collapsibleContentRow} automation-id="collapsible-content-row">
          <td colSpan={columns.length}>
            <div
              className={clsx(styles.collapsibleContentWrapper, {
                [styles.expanded]: isExpanded,
              })}
            >
              <div className={styles.collapsibleContentInner}>{collapsibleContent}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

TableRows.displayName = 'TableRows';

export default TableRows;
