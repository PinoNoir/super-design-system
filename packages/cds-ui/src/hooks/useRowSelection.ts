import { useCallback, useMemo, useState } from 'react';
import {
  TableSelectionCallback,
  RowIdExtractor,
  defaultRowIdExtractor,
} from '../components/data-table/types/data-table-generics';

export interface UseRowSelectionOptions<T> {
  multipleSelect?: boolean;
  initialSelectedIds?: string[];
  onSelectionChange?: TableSelectionCallback<T>;
  getRowId?: RowIdExtractor<T>;
  rowKey?: keyof T;
}

function useRowSelection<T>(options: UseRowSelectionOptions<T> = {}) {
  const { multipleSelect = true, initialSelectedIds = [], onSelectionChange, getRowId, rowKey } = options;

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(initialSelectedIds);
  const selectedRowsSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  // Create the row ID extractor based on options
  const rowIdExtractor = useMemo((): RowIdExtractor<T> => {
    if (getRowId) return getRowId;
    if (rowKey) return (item: T) => String(item[rowKey]);
    return defaultRowIdExtractor;
  }, [getRowId, rowKey]);

  // Core selection logic - handles the actual state update
  const updateSelection = useCallback(
    (rowId: string, newSelectionState: boolean) => {
      setSelectedRowIds((prev) => {
        const updatedSelections = new Set(prev);

        if (multipleSelect) {
          // Multiple selection mode
          if (newSelectionState) {
            updatedSelections.add(rowId);
          } else {
            updatedSelections.delete(rowId);
          }
        } else {
          // Single selection mode
          updatedSelections.clear();
          if (newSelectionState) {
            updatedSelections.add(rowId);
          }
        }

        return Array.from(updatedSelections);
      });
    },
    [multipleSelect],
  );

  // Main selection handler - simplified to match new callback signature
  const handleSelectionChange: TableSelectionCallback<T> = useCallback(
    (rowId, newSelectionState, context) => {
      // Update internal state
      updateSelection(rowId, newSelectionState);

      // Call external callback if provided
      if (onSelectionChange) {
        onSelectionChange(rowId, newSelectionState, context);
      }
    },
    [updateSelection, onSelectionChange],
  );

  // Select All functionality - simplified
  const handleSelectAll = useCallback(
    (shouldSelectAll: boolean, data: T[]) => {
      // Filter out disabled rows (if your data has disabled property)
      const selectableRows = data.filter((row) => {
        const hasDisabled = typeof row === 'object' && row !== null && 'disabled' in row;
        return !hasDisabled || !(row as any).disabled;
      });

      const selectableIds = selectableRows.map((row, index) => rowIdExtractor(row, data.indexOf(row)));

      if (shouldSelectAll) {
        if (multipleSelect) {
          // Add all selectable rows to selection
          setSelectedRowIds((prev) => [...new Set([...prev, ...selectableIds])]);
        } else {
          // For single select, only select the first selectable row
          const firstSelectableId = selectableIds[0];
          if (firstSelectableId) {
            setSelectedRowIds([firstSelectableId]);
          }
        }
      } else {
        // Deselect all
        setSelectedRowIds([]);
      }

      // Simplified external callback - no need to call for each row individually
      if (onSelectionChange) {
        // Just notify that a bulk operation occurred
        onSelectionChange('__bulk__', shouldSelectAll, {
          source: 'select-all',
        });
      }
    },
    [multipleSelect, onSelectionChange, rowIdExtractor],
  );

  // Check if a row is selected
  const isRowSelected = useCallback((rowId: string) => selectedRowsSet.has(rowId), [selectedRowsSet]);

  // Enhanced selection utilities
  const selectionUtils = useMemo(
    () => ({
      getSelectedCount: () => selectedRowIds.length,
      isAnySelected: () => selectedRowIds.length > 0,
      clearSelection: () => setSelectedRowIds([]),

      // Batch operations - simplified
      selectRows: (rowIds: string[]) => {
        if (multipleSelect) {
          setSelectedRowIds((prev) => [...new Set([...prev, ...rowIds])]);
        } else {
          const firstId = rowIds[0];
          if (firstId) {
            setSelectedRowIds([firstId]);
          }
        }
      },

      deselectRows: (rowIds: string[]) => {
        const idsToRemove = new Set(rowIds);
        setSelectedRowIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
      },

      // Single row operations
      selectRow: (rowId: string) => updateSelection(rowId, true),
      deselectRow: (rowId: string) => updateSelection(rowId, false),
      toggleRow: (rowId: string) => updateSelection(rowId, !selectedRowsSet.has(rowId)),

      // Selection state checks for visible data
      isAllSelected: (visibleRows: T[]) => {
        const selectableRows = visibleRows.filter((row) => {
          const hasDisabled = typeof row === 'object' && row !== null && 'disabled' in row;
          return !hasDisabled || !(row as any).disabled;
        });

        if (selectableRows.length === 0) return false;

        return selectableRows.every((row) => {
          const rowId = rowIdExtractor(row, visibleRows.indexOf(row));
          return selectedRowsSet.has(rowId);
        });
      },

      isSomeSelected: (visibleRows: T[]) => {
        const selectableRows = visibleRows.filter((row) => {
          const hasDisabled = typeof row === 'object' && row !== null && 'disabled' in row;
          return !hasDisabled || !(row as any).disabled;
        });

        if (selectableRows.length === 0) return false;

        const selectedCount = selectableRows.filter((row) => {
          const rowId = rowIdExtractor(row, visibleRows.indexOf(row));
          return selectedRowsSet.has(rowId);
        }).length;

        return selectedCount > 0 && selectedCount < selectableRows.length;
      },

      // Get selected data - works with any data type
      getSelectedRows: (data: T[]) =>
        data.filter((row, index) => {
          const rowId = rowIdExtractor(row, index);
          return selectedRowsSet.has(rowId);
        }),

      // Convenience methods for select all
      selectAllRows: (rows: T[]) => {
        const selectableRows = rows.filter((row) => {
          const hasDisabled = typeof row === 'object' && row !== null && 'disabled' in row;
          return !hasDisabled || !(row as any).disabled;
        });

        const selectableIds = selectableRows.map((row, index) => rowIdExtractor(row, rows.indexOf(row)));
        selectionUtils.selectRows(selectableIds);
      },

      deselectAllRows: () => selectionUtils.clearSelection(),

      // Get row ID for external use
      getRowId: rowIdExtractor,
    }),
    [selectedRowIds, selectedRowsSet, multipleSelect, updateSelection, rowIdExtractor],
  );

  return {
    // Core state
    selectedRowIds,

    // Main handlers (these are what you pass to Table component)
    handleSelectionChange,
    handleSelectAll,
    isRowSelected,

    // Row ID extractor for external use
    getRowId: rowIdExtractor,

    // Utility methods
    ...selectionUtils,
  } as const;
}

export default useRowSelection;
