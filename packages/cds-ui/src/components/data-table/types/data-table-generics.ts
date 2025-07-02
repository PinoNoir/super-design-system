import React from 'react';

// ============================================================================
// CORE TYPES - No constraints on data structure
// ============================================================================

/**
 * Generic table data - can be any array of objects
 */
export type TableDataProps<T> = T[];

/**
 * Function to extract a unique identifier from any data item
 */
export type RowIdExtractor<T> = (item: T, index: number) => string;

/**
 * Sort order for columns
 */
export type SortOrder = 'ascending' | 'descending' | 'none';

// ============================================================================
// SELECTION TYPES - Flexible without base interface constraints
// ============================================================================

/**
 * Context information for selection events
 */
export interface SelectionContext {
  source?: 'checkbox' | 'button' | 'row' | 'select-all' | 'header-checkbox' | 'keyboard';
}

/**
 * Standardized selection callback - works with any data type
 */
export type TableSelectionCallback<T> = (rowId: string, newSelectionState: boolean, context: SelectionContext) => void;

/**
 * Selection state helpers - no longer tied to TableRowBase
 */
export interface SelectionState {
  selectedRowIds: string[];
  isRowSelected: (rowId: string) => boolean;
  getSelectedCount: () => number;
  isAnySelected: () => boolean;
}

// ============================================================================
// COLUMN DEFINITION - Flexible for any data type
// ============================================================================

/**
 * Context passed to column render functions
 */
export interface RenderContext {
  isSelected: boolean;
  isRowDisabled: boolean;
  isRowDraggable: boolean;
  isSortable: boolean;
  rowIndex: number;
  rowId: string;
}

/**
 * Column definition - works with any data type T
 */
export interface TableColumnProps<T> {
  id?: string;
  key: string;
  header: string | React.ReactNode;
  width?: React.CSSProperties['width'];
  isSortable: boolean;
  isDisabled?: boolean;
  render: (data: T, context: RenderContext) => React.ReactNode;
}

// ============================================================================
// ROW STATE HELPERS - Optional functions to determine row state
// ============================================================================

/**
 * Function to determine if a row is disabled
 */
export type RowDisabledPredicate<T> = (item: T, index: number) => boolean;

/**
 * Function to determine if a row is selected
 */
export type RowSelectedPredicate<T> = (item: T, index: number) => boolean;

/**
 * Function to determine if a row is draggable
 */
export type RowDraggablePredicate<T> = (item: T, index: number) => boolean;

// ============================================================================
// SERVER-SIDE CONFIGURATION
// ============================================================================

export interface ServerSideConfig {
  enabled: boolean;
  totalItems: number;
  isLoading?: boolean;
  error?: string | null;
  onPageChange?: (page: number) => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
  itemDescription?: ItemDescription | string;
  pageInfoText?: string;
}

export interface ItemDescription {
  singular: string;
  plural: string;
}

// ============================================================================
// DRAG AND DROP TYPES
// ============================================================================

export interface DragDropConfig<T> {
  enabled: boolean;
  onRowDragEnd?: (oldIndex: number, newIndex: number, data: T[]) => void;
  dragHandle?: boolean; // Whether to show drag handle column
}

// ============================================================================
// TABLE CONFIGURATION - Main props interface
// ============================================================================

/**
 * Main table configuration - completely flexible for any data type
 */
export interface TableConfig<T> {
  // Core required props
  data: T[];
  columns: TableColumnProps<T>[];

  // Row identification (flexible - user chooses how to identify rows)
  rowKey?: keyof T; // Use a field from data
  getRowId?: RowIdExtractor<T>; // Custom ID extraction

  // Row state predicates (optional - user defines behavior)
  isRowDisabled?: RowDisabledPredicate<T>;
  isRowSelected?: RowSelectedPredicate<T>;
  isRowDraggable?: RowDraggablePredicate<T>;

  // Selection handling
  selectedRowIds?: string[];
  onSelectionChange?: TableSelectionCallback<T>;

  // Select all functionality
  enableSelectAll?: boolean;
  onSelectAll?: (shouldSelectAll: boolean, data: T[]) => void;

  // Sorting
  sortKey?: string;
  sortDirection?: SortOrder;
  onSort?: (key: string) => void;

  // Pagination
  enablePagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Advanced features
  dragDrop?: DragDropConfig<T>;
  serverSide?: ServerSideConfig;

  // Styling
  className?: string;
  rowHeight?: 'base' | 'condensed';
  borderRadius?: 'none' | 'rounded';
}

// ============================================================================
// UTILITY TYPES AND HELPERS
// ============================================================================

/**
 * Default row ID extractor - tries common ID fields, falls back to index
 */
export const defaultRowIdExtractor = <T>(item: T, index: number): string => {
  // Try common ID field names
  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, any>;

    // Common ID field patterns
    const idFields = ['id', '_id', 'uuid', 'key', 'pk'];
    for (const field of idFields) {
      if (field in obj && (typeof obj[field] === 'string' || typeof obj[field] === 'number')) {
        return String(obj[field]);
      }
    }
  }

  // Fallback to index
  return index.toString();
};

/**
 * Helper to create a row ID extractor from a key
 */
export const createRowIdExtractor = <T>(key: keyof T): RowIdExtractor<T> => {
  return (item: T) => String(item[key]);
};

/**
 * Helper to determine if data has a common ID field
 */
export const hasCommonIdField = <T>(data: T[]): keyof T | null => {
  if (data.length === 0) return null;

  const firstItem = data[0];
  if (typeof firstItem !== 'object' || firstItem === null) return null;

  const commonFields = ['id', '_id', 'uuid', 'key'] as const;

  for (const field of commonFields) {
    if (field in firstItem) {
      return field as keyof T;
    }
  }

  return null;
};

// ============================================================================
// LEGACY SUPPORT (Optional - for backward compatibility)
// ============================================================================

/**
 * @deprecated Use flexible TableConfig instead
 * Legacy interface for backward compatibility
 */
export interface TableRowBase {
  id: string;
  disabled?: boolean;
  selected?: boolean;
  draggable?: boolean;
  [key: string]: any;
}

/**
 * @deprecated Use TableConfig<T> instead
 * Legacy type alias for backward compatibility
 */
export type LegacyTableDataProps<T extends TableRowBase> = T[];

/**
 * @deprecated Use TableSelectionCallback<T> instead
 * Legacy selection callback with TableRowBase constraint
 */
export type LegacySelectionCallback<T extends TableRowBase> = TableSelectionCallback<T>;

// ============================================================================
// EXAMPLES OF USAGE
// ============================================================================

/*
// Example 1: Simple usage with automatic ID detection
interface User {
  id: number;
  name: string;
  email: string;
}

const userTableConfig: TableConfig<User> = {
  data: users,
  columns: userColumns,
  // No rowKey needed - will auto-detect 'id' field
};

// Example 2: Custom ID extraction
interface Product {
  productId: string;
  title: string;
  price: number;
}

const productTableConfig: TableConfig<Product> = {
  data: products,
  columns: productColumns,
  rowKey: 'productId', // Use specific field
};

// Example 3: Complex custom ID logic
interface ComplexData {
  category: string;
  items: Array<{ uuid: string; name: string }>;
}

const complexTableConfig: TableConfig<ComplexData> = {
  data: complexData,
  columns: complexColumns,
  getRowId: (item, index) => `${item.category}-${index}`,
  isRowDisabled: (item) => item.items.length === 0,
};
*/
