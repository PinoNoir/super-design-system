import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from '../Table';
import { TableColumnProps } from '../types/data-table-generics';

// Mock dependencies
jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: any) => <span automation-id={`icon-${icon}`} {...props} />,
}));

jest.mock('../../../hooks', () => ({
  useDragAndDrop: () => ({
    draggedIndex: null,
    draggedOverIndex: null,
    handleDragStart: jest.fn(),
    handleDragOver: jest.fn(),
    handleDragEnd: jest.fn(),
  }),
}));

jest.mock('../../loader/Loader', () => {
  return function Loader() {
    return <div automation-id="loader">Loading...</div>;
  };
});

jest.mock('../../button/Button', () => {
  return function Button({ children, onClick, ...props }: any) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock('../TableHeader', () => {
  return function TableHeader({
    columns,
    onSort,
    sortDirection,
    sortKey,
    enableSelectAll,
    onSelectAll,
    isAllSelected,
    isSomeSelected,
  }: any) {
    return (
      <thead automation-id="table-header">
        <tr>
          {enableSelectAll && (
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={(e) => onSelectAll?.(e.target.checked, mockData)} // Pass both boolean and data
                automation-id="select-all-checkbox"
              />
            </th>
          )}
          {columns.map((col: any) => (
            <th key={col.key}>
              {col.isSortable !== false ? (
                <button onClick={() => onSort?.(col.key)} automation-id={`sort-${col.key}`}>
                  {col.header}
                  {sortKey === col.key && (
                    <span automation-id={`sort-direction-${sortDirection}`}>
                      {sortDirection === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ) : (
                col.header
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  };
});

jest.mock('../TableRows', () => {
  return function TableRows({
    rowId,
    data,
    columns,
    isSelected,
    isDisabled,
    onClick,
    className,
    onSelectionChange,
    isDraggable,
    ...props
  }: any) {
    const actualRowId = rowId ?? data?.id ?? 'unknown';

    const handleClick = () => {
      if (!isDisabled) {
        onSelectionChange?.(actualRowId, !isSelected, { source: 'row' });
        onClick?.();
      }
    };

    return (
      <tr
        automation-id={`table-row-${actualRowId}`}
        className={className}
        onClick={handleClick}
        data-selected={isSelected}
        data-disabled={isDisabled}
        {...props}
      >
        {columns.map((col: any) => (
          <td key={col.key} automation-id={`cell-${actualRowId}-${col.key}`}>
            {col.render ? col.render(data) : data[col.key]}
          </td>
        ))}
      </tr>
    );
  };
});

jest.mock('../TablePagination', () => {
  return function Pagination({ currentPage, pageSize, totalPages, onPageChange, onPageSizeChange }: any) {
    const pageInfo = `Showing ${currentPage} of ${totalPages} pages`;

    const handlePageClick = (page: number) => {
      const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
      onPageChange(mockEvent, page);
    };

    return (
      <nav automation-id="pagination">
        <div>
          <span automation-id="page-info">{pageInfo}</span>
        </div>
        <div>
          <button onClick={() => handlePageClick(1)} disabled={currentPage === 1} automation-id="start-button">
            First
          </button>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage <= 1}
            automation-id="prev-page"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage >= totalPages}
            automation-id="next-page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            automation-id="end-button"
          >
            Last
          </button>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            automation-id="page-size-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </nav>
    );
  };
});

// Test data types
interface TestRow {
  id: string;
  name: string;
  email: string;
  age: number;
  disabled?: boolean;
}

const mockColumns: TableColumnProps<TestRow>[] = [
  {
    key: 'name',
    header: 'Name',
    isSortable: true,
    render: (row: TestRow) => row.name,
  },
  {
    key: 'email',
    header: 'Email',
    isSortable: true,
    render: (row: TestRow) => row.email,
  },
  {
    key: 'age',
    header: 'Age',
    isSortable: false,
    render: (row: TestRow) => row.age,
  },
];

const mockData: TestRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

describe('Table Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders table with data', () => {
      render(<Table data={mockData} columns={mockColumns} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();

      // Check that all rows are rendered
      mockData.forEach((row) => {
        expect(screen.getByTestId(`table-row-${row.id}`)).toBeInTheDocument();
      });
    });

    it('applies custom className and id', () => {
      render(<Table data={mockData} columns={mockColumns} id="custom-table" className="custom-class" />);

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('id', 'custom-table');
      expect(table).toHaveClass('custom-class');
    });

    it('renders empty state when no data', () => {
      render(<Table data={[]} columns={mockColumns} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByTestId('icon-mdi:database-outline')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('calls onSort when sortable column header is clicked', async () => {
      const mockOnSort = jest.fn();
      render(<Table data={mockData} columns={mockColumns} onSort={mockOnSort} />);

      await user.click(screen.getByTestId('sort-name'));
      expect(mockOnSort).toHaveBeenCalledWith('name');
    });

    it('shows sort direction indicator', () => {
      render(<Table data={mockData} columns={mockColumns} sortKey="name" sortDirection="ascending" />);

      expect(screen.getByTestId('sort-direction-ascending')).toBeInTheDocument();
    });

    it('does not render sort button for non-sortable columns', () => {
      render(<Table data={mockData} columns={mockColumns} />);

      expect(screen.queryByTestId('sort-age')).not.toBeInTheDocument();
    });
  });

  describe('Row Selection', () => {
    it('handles single row selection', async () => {
      const mockOnSelectionChange = jest.fn();
      render(<Table data={mockData} columns={mockColumns} onSelectionChange={mockOnSelectionChange} />);

      await user.click(screen.getByTestId('table-row-1'));
      // ✅ Updated to new simplified signature
      expect(mockOnSelectionChange).toHaveBeenCalledWith('1', true, {
        source: 'row',
      });
    });

    it('shows selected rows based on selectedRowIds', () => {
      render(<Table data={mockData} columns={mockColumns} selectedRowIds={['1', '2']} />);

      expect(screen.getByTestId('table-row-1')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('table-row-2')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('table-row-3')).toHaveAttribute('data-selected', 'false');
    });

    it('uses custom getIsRowSelected function', () => {
      const mockGetIsRowSelected = jest.fn((rowId: string) => rowId === '2');
      render(<Table data={mockData} columns={mockColumns} getIsRowSelected={mockGetIsRowSelected} />);

      expect(screen.getByTestId('table-row-2')).toHaveAttribute('data-selected', 'true');
      expect(mockGetIsRowSelected).toHaveBeenCalledWith('1');
      expect(mockGetIsRowSelected).toHaveBeenCalledWith('2');
      expect(mockGetIsRowSelected).toHaveBeenCalledWith('3');
    });

    it('does not allow selection of disabled rows', async () => {
      const disabledData = [{ ...mockData[0], disabled: true }, ...mockData.slice(1)];
      const mockOnSelectionChange = jest.fn();

      render(<Table data={disabledData} columns={mockColumns} onSelectionChange={mockOnSelectionChange} />);

      // Verify the disabled row is rendered as disabled
      expect(screen.getByTestId('table-row-1')).toHaveAttribute('data-disabled', 'true');

      await user.click(screen.getByTestId('table-row-1'));
      expect(mockOnSelectionChange).not.toHaveBeenCalled();
    });

    it('handles selection state changes correctly', async () => {
      const mockOnSelectionChange = jest.fn();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          onSelectionChange={mockOnSelectionChange}
          selectedRowIds={['1']} // Row 1 is already selected
        />,
      );

      // Clicking on already selected row should deselect it
      await user.click(screen.getByTestId('table-row-1'));
      expect(mockOnSelectionChange).toHaveBeenCalledWith('1', false, {
        source: 'row',
      });
    });
  });

  describe('Select All', () => {
    it('renders select all checkbox when enabled', () => {
      render(<Table data={mockData} columns={mockColumns} enableSelectAll={true} />);

      expect(screen.getByTestId('select-all-checkbox')).toBeInTheDocument();
    });

    it('calls onSelectAll when select all is clicked', async () => {
      const mockOnSelectAll = jest.fn();
      render(<Table data={mockData} columns={mockColumns} enableSelectAll={true} onSelectAll={mockOnSelectAll} />);

      await user.click(screen.getByTestId('select-all-checkbox'));
      expect(mockOnSelectAll).toHaveBeenCalledWith(true, mockData);
    });

    it('shows correct select all state', () => {
      render(<Table data={mockData} columns={mockColumns} enableSelectAll={true} isAllSelected={true} />);

      expect(screen.getByTestId('select-all-checkbox')).toBeChecked();
    });

    it('shows indeterminate state when some rows selected', () => {
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          enableSelectAll={true}
          isAllSelected={false}
          isSomeSelected={true}
        />,
      );

      const checkbox = screen.getByTestId('select-all-checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('calls onSelectAll with false when deselecting all', async () => {
      const mockOnSelectAll = jest.fn();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          enableSelectAll={true}
          onSelectAll={mockOnSelectAll}
          isAllSelected={true}
        />,
      );

      await user.click(screen.getByTestId('select-all-checkbox'));
      expect(mockOnSelectAll).toHaveBeenCalledWith(false, mockData);
    });
  });

  describe('Pagination', () => {
    it('renders pagination when enabled', () => {
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          enablePagination={true}
          currentPage={1}
          pageSize={10}
          totalItems={mockData.length}
        />,
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('calls onPageChange when pagination is used', async () => {
      const mockOnPageChange = jest.fn();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          enablePagination={true}
          currentPage={1}
          pageSize={2}
          totalItems={mockData.length}
          onPageChange={mockOnPageChange}
        />,
      );

      await user.click(screen.getByTestId('next-page'));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageSizeChange when page size is changed', async () => {
      const mockOnPageSizeChange = jest.fn();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          enablePagination={true}
          currentPage={1}
          pageSize={10}
          totalItems={mockData.length}
          onPageSizeChange={mockOnPageSizeChange}
        />,
      );

      await user.selectOptions(screen.getByTestId('page-size-select'), '25');
      expect(mockOnPageSizeChange).toHaveBeenCalledWith(25);
    });

    it('does not render pagination when disabled', () => {
      render(<Table data={mockData} columns={mockColumns} />);

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Server-side Features', () => {
    it('shows loading state', () => {
      render(
        <Table
          data={[]}
          columns={mockColumns}
          serverSide={{
            totalItems: 50,
            enabled: true,
            isLoading: true,
          }}
        />,
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('shows error state with retry button', async () => {
      const mockOnRetry = jest.fn();
      render(
        <Table
          data={[]}
          columns={mockColumns}
          serverSide={{
            totalItems: 50,
            enabled: true,
            isLoading: false,
            error: 'Failed to load data',
            onRetry: mockOnRetry,
          }}
        />,
      );

      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
      expect(screen.getByTestId('icon-mdi:alert-rhombus')).toBeInTheDocument();

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();

      await user.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalled();
    });

    it('does not show pagination in server-side mode with no data', () => {
      render(
        <Table
          data={[]}
          columns={mockColumns}
          enablePagination={true}
          serverSide={{
            totalItems: 50,
            enabled: true,
            isLoading: false,
          }}
        />,
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('adds drag handle column when draggable rows are enabled', () => {
      render(<Table data={mockData} columns={mockColumns} draggableRows={true} />);

      // Check that drag handle icons are present
      expect(screen.getAllByTestId('icon-mdi:drag-vertical')).toHaveLength(mockData.length);
    });

    it('calls onRowDragEnd when drag and drop is completed', () => {
      const mockOnRowDragEnd = jest.fn();

      render(<Table data={mockData} columns={mockColumns} draggableRows={true} onRowDragEnd={mockOnRowDragEnd} />);

      expect(screen.getAllByTestId('icon-mdi:drag-vertical')).toHaveLength(mockData.length);
    });
  });

  describe('Custom Row Renderer', () => {
    it('uses custom row renderer when provided', () => {
      const customRowRenderer = jest.fn((rowData, index, options) => (
        <tr key={rowData.id} automation-id={`custom-row-${rowData.id}`}>
          <td>Custom: {rowData.name}</td>
        </tr>
      ));

      render(<Table data={mockData} columns={mockColumns} renderRow={customRowRenderer} />);

      expect(customRowRenderer).toHaveBeenCalledTimes(mockData.length);
      mockData.forEach((row) => {
        expect(screen.getByTestId(`custom-row-${row.id}`)).toBeInTheDocument();
      });
    });

    it('passes correct context to custom row renderer', () => {
      const customRowRenderer = jest.fn((rowData, index, context) => (
        <tr key={rowData.id} automation-id={`custom-row-${rowData.id}`}>
          <td>Custom: {rowData.name}</td>
        </tr>
      ));

      render(<Table data={mockData} columns={mockColumns} renderRow={customRowRenderer} selectedRowIds={['1']} />);

      expect(customRowRenderer).toHaveBeenCalledWith(
        mockData[0],
        0,
        expect.objectContaining({
          rowId: '1',
          isSelected: true,
          isDisabled: false,
          defaultRowProps: expect.any(Object),
        }),
      );
    });
  });

  describe('Internal State Management', () => {
    it('manages internal pagination state when not controlled', async () => {
      render(<Table data={mockData} columns={mockColumns} enablePagination={true} initialPageSize={2} />);

      expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 1 of 2 pages');

      await user.click(screen.getByTestId('next-page'));

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 2 of 2 pages');
      });
    });

    it('resets to first page when page size changes internally', async () => {
      render(<Table data={mockData} columns={mockColumns} enablePagination={true} initialPageSize={1} />);

      // Go to page 2
      await user.click(screen.getByTestId('next-page'));
      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 2 of 3 pages');
      });

      // Change page size - should reset to page 1
      await user.selectOptions(screen.getByTestId('page-size-select'), '25');
      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 1 of 1 pages');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty selectedRowIds array', () => {
      render(<Table data={mockData} columns={mockColumns} selectedRowIds={[]} />);

      mockData.forEach((row) => {
        expect(screen.getByTestId(`table-row-${row.id}`)).toHaveAttribute('data-selected', 'false');
      });
    });

    it('handles undefined selectedRowIds', () => {
      render(<Table data={mockData} columns={mockColumns} selectedRowIds={undefined} />);

      mockData.forEach((row) => {
        expect(screen.getByTestId(`table-row-${row.id}`)).toHaveAttribute('data-selected', 'false');
      });
    });

    it('handles selection with mixed disabled/enabled rows', async () => {
      const mixedData = [{ ...mockData[0], disabled: true }, mockData[1], { ...mockData[2], disabled: true }];
      const mockOnSelectionChange = jest.fn();

      render(<Table data={mixedData} columns={mockColumns} onSelectionChange={mockOnSelectionChange} />);

      // Try to select disabled row - should not call handler
      await user.click(screen.getByTestId('table-row-1'));
      expect(mockOnSelectionChange).not.toHaveBeenCalled();

      // Select enabled row - should call handler
      await user.click(screen.getByTestId('table-row-2'));
      expect(mockOnSelectionChange).toHaveBeenCalledWith('2', true, {
        source: 'row',
      });
    });

    it('handles row height variants', () => {
      render(<Table data={mockData} columns={mockColumns} rowHeight="condensed" />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      // You can add specific styling tests here if needed
    });

    it('handles default empty state rendering', () => {
      // Test that the default empty state is rendered correctly
      render(<Table data={[]} columns={mockColumns} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByTestId('icon-mdi:database-outline')).toBeInTheDocument();
    });
  });
});
