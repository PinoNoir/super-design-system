import { renderHook, act } from '@testing-library/react';
import useRowSelection from '../useRowSelection';

// Test data interface - simplified (no need for TableRowBase)
interface TestRow {
  id: string;
  name: string;
  disabled?: boolean;
}

// Mock data
const mockData: TestRow[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson', disabled: true },
  { id: '4', name: 'Alice Brown' },
  { id: '5', name: 'Charlie Wilson' },
];

const selectableRows = mockData.filter((row) => !row.disabled);
const selectableIds = selectableRows.map((row) => row.id);

describe('useRowSelection Hook', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>());

      expect(result.current.selectedRowIds).toEqual([]);
      expect(result.current.getSelectedCount()).toBe(0);
      expect(result.current.isAnySelected()).toBe(false);
      expect(result.current.isRowSelected('1')).toBe(false);
    });

    it('should initialize with provided initial selected IDs', () => {
      const initialIds = ['1', '2'];
      const { result } = renderHook(() => useRowSelection<TestRow>({ initialSelectedIds: initialIds }));

      expect(result.current.selectedRowIds).toEqual(initialIds);
      expect(result.current.getSelectedCount()).toBe(2);
      expect(result.current.isAnySelected()).toBe(true);
      expect(result.current.isRowSelected('1')).toBe(true);
      expect(result.current.isRowSelected('2')).toBe(true);
      expect(result.current.isRowSelected('3')).toBe(false);
    });

    it('should initialize with correct multipleSelect setting', () => {
      const { result: multipleResult } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      const { result: singleResult } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: false }));

      // Both should initialize the same way, behavior differs on selection
      expect(multipleResult.current.selectedRowIds).toEqual([]);
      expect(singleResult.current.selectedRowIds).toEqual([]);
    });
  });

  describe('Single Row Selection', () => {
    describe('Multiple Select Mode', () => {
      it('should select a single row', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.handleSelectionChange('1', true, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual(['1']);
        expect(result.current.isRowSelected('1')).toBe(true);
        expect(result.current.getSelectedCount()).toBe(1);
      });

      it('should select multiple rows', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.handleSelectionChange('1', true, {
            source: 'checkbox',
          });
        });

        act(() => {
          result.current.handleSelectionChange('2', true, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual(['1', '2']);
        expect(result.current.getSelectedCount()).toBe(2);
      });

      it('should deselect a row', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2'],
          }),
        );

        act(() => {
          result.current.handleSelectionChange('1', false, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual(['2']);
        expect(result.current.isRowSelected('1')).toBe(false);
        expect(result.current.isRowSelected('2')).toBe(true);
      });
    });

    describe('Single Select Mode', () => {
      it('should select only one row at a time', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: false }));

        act(() => {
          result.current.handleSelectionChange('1', true, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual(['1']);

        act(() => {
          result.current.handleSelectionChange('2', true, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual(['2']);
        expect(result.current.isRowSelected('1')).toBe(false);
        expect(result.current.isRowSelected('2')).toBe(true);
      });

      it('should deselect the current row when selecting false', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: false,
            initialSelectedIds: ['1'],
          }),
        );

        act(() => {
          result.current.handleSelectionChange('1', false, {
            source: 'checkbox',
          });
        });

        expect(result.current.selectedRowIds).toEqual([]);
        expect(result.current.getSelectedCount()).toBe(0);
      });
    });
  });

  describe('Select All Functionality', () => {
    describe('Multiple Select Mode', () => {
      it('should select all selectable rows', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.handleSelectAll(true, mockData);
        });

        expect(result.current.selectedRowIds).toEqual(selectableIds);
        expect(result.current.getSelectedCount()).toBe(selectableIds.length);
        selectableIds.forEach((id) => {
          expect(result.current.isRowSelected(id)).toBe(true);
        });
        // Disabled row should not be selected
        expect(result.current.isRowSelected('3')).toBe(false);
      });

      it('should deselect all rows', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2', '4'],
          }),
        );

        act(() => {
          result.current.handleSelectAll(false, mockData);
        });

        expect(result.current.selectedRowIds).toEqual([]);
        expect(result.current.getSelectedCount()).toBe(0);
      });

      it('should merge with existing selections', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1'],
          }),
        );

        act(() => {
          result.current.handleSelectAll(true, mockData);
        });

        expect(result.current.selectedRowIds).toEqual(selectableIds);
      });
    });

    describe('Single Select Mode', () => {
      it('should select only the first selectable row', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: false }));

        act(() => {
          result.current.handleSelectAll(true, mockData);
        });

        expect(result.current.selectedRowIds).toEqual(['1']); // First selectable row
        expect(result.current.getSelectedCount()).toBe(1);
      });

      it('should handle empty data gracefully', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: false }));

        act(() => {
          result.current.handleSelectAll(true, []);
        });

        expect(result.current.selectedRowIds).toEqual([]);
      });
    });
  });

  describe('Selection State Checks', () => {
    it('should correctly identify when all visible rows are selected', () => {
      const { result } = renderHook(() =>
        useRowSelection<TestRow>({
          multipleSelect: true,
          initialSelectedIds: selectableIds, // All selectable rows
        }),
      );

      expect(result.current.isAllSelected(mockData)).toBe(true);
      expect(result.current.isSomeSelected(mockData)).toBe(false);
    });

    it('should correctly identify when some rows are selected', () => {
      const { result } = renderHook(() =>
        useRowSelection<TestRow>({
          multipleSelect: true,
          initialSelectedIds: ['1', '2'], // Some but not all
        }),
      );

      expect(result.current.isAllSelected(mockData)).toBe(false);
      expect(result.current.isSomeSelected(mockData)).toBe(true);
    });

    it('should correctly identify when no rows are selected', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      expect(result.current.isAllSelected(mockData)).toBe(false);
      expect(result.current.isSomeSelected(mockData)).toBe(false);
    });

    it('should handle data with all disabled rows', () => {
      const disabledData: TestRow[] = [
        { id: '1', name: 'Disabled 1', disabled: true },
        { id: '2', name: 'Disabled 2', disabled: true },
      ];

      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      expect(result.current.isAllSelected(disabledData)).toBe(false);
      expect(result.current.isSomeSelected(disabledData)).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    describe('Batch Operations', () => {
      it('should select multiple rows with selectRows', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.selectRows(['1', '2', '4']);
        });

        expect(result.current.selectedRowIds).toEqual(['1', '2', '4']);
      });

      it('should deselect multiple rows with deselectRows', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2', '4', '5'],
          }),
        );

        act(() => {
          result.current.deselectRows(['2', '4']);
        });

        expect(result.current.selectedRowIds).toEqual(['1', '5']);
      });

      it('should handle duplicate IDs in batch operations', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.selectRows(['1', '1', '2', '2']);
        });

        expect(result.current.selectedRowIds).toEqual(['1', '2']);
      });
    });

    describe('Single Row Operations', () => {
      it('should select single row with selectRow', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.selectRow('1');
        });

        expect(result.current.isRowSelected('1')).toBe(true);
      });

      it('should deselect single row with deselectRow', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2'],
          }),
        );

        act(() => {
          result.current.deselectRow('1');
        });

        expect(result.current.selectedRowIds).toEqual(['2']);
      });

      it('should toggle row selection with toggleRow', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        // Toggle on
        act(() => {
          result.current.toggleRow('1');
        });

        expect(result.current.isRowSelected('1')).toBe(true);

        // Toggle off
        act(() => {
          result.current.toggleRow('1');
        });

        expect(result.current.isRowSelected('1')).toBe(false);
      });
    });

    describe('Data Utilities', () => {
      it('should return selected rows data with getSelectedRows', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2'],
          }),
        );

        const selectedRows = result.current.getSelectedRows(mockData);
        expect(selectedRows).toEqual([mockData[0], mockData[1]]);
        expect(selectedRows).toHaveLength(2);
      });

      it('should clear all selections with clearSelection', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2', '4'],
          }),
        );

        act(() => {
          result.current.clearSelection();
        });

        expect(result.current.selectedRowIds).toEqual([]);
        expect(result.current.getSelectedCount()).toBe(0);
      });

      it('should select all visible rows with selectAllRows', () => {
        const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

        act(() => {
          result.current.selectAllRows(mockData);
        });

        expect(result.current.selectedRowIds).toEqual(selectableIds);
      });

      it('should deselect all rows with deselectAllRows', () => {
        const { result } = renderHook(() =>
          useRowSelection<TestRow>({
            multipleSelect: true,
            initialSelectedIds: ['1', '2'],
          }),
        );

        act(() => {
          result.current.deselectAllRows();
        });

        expect(result.current.selectedRowIds).toEqual([]);
      });
    });
  });

  describe('External Callbacks', () => {
    it('should call onSelectionChange callback when provided', () => {
      const mockCallback = jest.fn();
      const { result } = renderHook(() =>
        useRowSelection<TestRow>({
          multipleSelect: true,
          onSelectionChange: mockCallback,
        }),
      );

      act(() => {
        result.current.handleSelectionChange('1', true, {
          source: 'checkbox',
        });
      });

      expect(mockCallback).toHaveBeenCalledWith('1', true, {
        source: 'checkbox',
      });
    });

    it('should call onSelectionChange for bulk selectAll operation', () => {
      const mockCallback = jest.fn();
      const { result } = renderHook(() =>
        useRowSelection<TestRow>({
          multipleSelect: true,
          onSelectionChange: mockCallback,
        }),
      );

      act(() => {
        result.current.handleSelectAll(true, mockData);
      });

      // Should be called once for the bulk operation (based on the simplified implementation)
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('__bulk__', true, {
        source: 'select-all',
      });
    });

    it('should work without external callback', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      // Should not throw when no callback provided
      expect(() => {
        act(() => {
          result.current.handleSelectionChange('1', true, {
            source: 'checkbox',
          });
        });
      }).not.toThrow();

      expect(result.current.isRowSelected('1')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle selecting non-existent row IDs', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      act(() => {
        result.current.selectRows(['999', 'abc']);
      });

      expect(result.current.selectedRowIds).toEqual(['999', 'abc']);
      expect(result.current.isRowSelected('999')).toBe(true);
    });

    it('should handle deselecting non-selected rows', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      act(() => {
        result.current.deselectRows(['1', '2']);
      });

      expect(result.current.selectedRowIds).toEqual([]);
    });

    it('should maintain selection order', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      act(() => {
        result.current.selectRow('2');
      });

      act(() => {
        result.current.selectRow('1');
      });

      act(() => {
        result.current.selectRow('4');
      });

      expect(result.current.selectedRowIds).toEqual(['2', '1', '4']);
    });

    it('should handle single select mode with batch operations', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: false }));

      act(() => {
        result.current.selectRows(['1', '2', '4']);
      });

      // In single select mode, should only select the first ID
      expect(result.current.selectedRowIds).toEqual(['1']);
    });

    it('should handle different source types', () => {
      const mockCallback = jest.fn();
      const { result } = renderHook(() =>
        useRowSelection<TestRow>({
          multipleSelect: true,
          onSelectionChange: mockCallback,
        }),
      );

      act(() => {
        result.current.handleSelectionChange('1', true, { source: 'checkbox' });
      });

      act(() => {
        result.current.handleSelectionChange('2', true, { source: 'button' });
      });

      expect(mockCallback).toHaveBeenNthCalledWith(1, '1', true, { source: 'checkbox' });
      expect(mockCallback).toHaveBeenNthCalledWith(2, '2', true, { source: 'button' });
    });
  });

  describe('Performance and Stability', () => {
    it('should maintain referential stability of handlers', () => {
      const { result, rerender } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      const firstHandleSelectionChange = result.current.handleSelectionChange;
      const firstHandleSelectAll = result.current.handleSelectAll;
      const firstIsRowSelected = result.current.isRowSelected;

      rerender();

      expect(result.current.handleSelectionChange).toBe(firstHandleSelectionChange);
      expect(result.current.handleSelectAll).toBe(firstHandleSelectAll);
      expect(result.current.isRowSelected).toBe(firstIsRowSelected);
    });

    it('should handle rapid selection changes', () => {
      const { result } = renderHook(() => useRowSelection<TestRow>({ multipleSelect: true }));

      act(() => {
        // Rapid fire selections
        result.current.selectRow('1');
        result.current.selectRow('2');
        result.current.deselectRow('1');
        result.current.toggleRow('3');
        result.current.selectRow('4');
      });

      expect(result.current.selectedRowIds).toEqual(['2', '3', '4']);
    });

    it('should work with custom row ID extraction', () => {
      interface CustomRow {
        customId: string;
        title: string;
      }

      const customData: CustomRow[] = [
        { customId: 'a', title: 'First' },
        { customId: 'b', title: 'Second' },
      ];

      const { result } = renderHook(() =>
        useRowSelection<CustomRow>({
          multipleSelect: true,
          rowKey: 'customId' as keyof CustomRow,
        }),
      );

      act(() => {
        result.current.handleSelectionChange('a', true, { source: 'checkbox' });
      });

      expect(result.current.isRowSelected('a')).toBe(true);
      expect(result.current.getSelectedRows(customData)).toEqual([customData[0]]);
    });
  });
});
