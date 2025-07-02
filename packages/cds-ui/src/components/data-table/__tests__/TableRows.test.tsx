import { render, screen, fireEvent } from '@testing-library/react';
import TableRows from '../TableRows';
import { TableColumnProps } from '../types/data-table-generics';

// Mock TableCell component
jest.mock('../TableCell', () => ({ children, ...props }: any) => <td {...props}>{children}</td>);

// Alternative: Create a more complete table structure if needed
const FullTableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'table' }}>
    <div style={{ display: 'table-row-group' }}>{children}</div>
  </div>
);

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

// Test data interface
interface TestRowData {
  id: string;
  name: string;
  disabled?: boolean;
}

// Helper type for render context
type RenderContext = {
  isSelected: boolean;
  isRowDisabled: boolean;
  isRowDraggable: boolean;
  isSortable: boolean;
  rowIndex: number;
  rowId: string;
};

describe('TableRows Component', () => {
  const mockData: TestRowData = {
    id: 'row1',
    name: 'Test Name',
    disabled: false,
  };

  const mockColumns: TableColumnProps<TestRowData>[] = [
    {
      key: 'name',
      header: 'Name',
      isSortable: false,
      render: (data: TestRowData, context: RenderContext) => data.name,
    },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    rowId: 'row1',
    isSelected: false,
    isDisabled: false,
  };

  const customRender = (ui: React.ReactElement, options?: any) => {
    // Suppress the validateDOMNesting warning for tests since we're testing in isolation
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0]?.includes?.('validateDOMNesting')) {
        return; // Suppress this specific warning in tests
      }
      originalError(...args);
    };

    const result = render(ui, {
      wrapper: TableWrapper,
      ...options,
    });

    // Restore console.error
    console.error = originalError;

    return result;
  };

  it('should render without crashing', () => {
    customRender(<TableRows {...defaultProps} />);
    expect(screen.getByText('Test Name')).toBeInTheDocument();
  });

  it('should apply custom className and style', () => {
    const customClass = 'custom-class';
    const customStyle = { backgroundColor: 'red' };

    customRender(<TableRows {...defaultProps} className={customClass} style={customStyle} />);

    const row = screen.getByTestId('table-row');
    expect(row.getAttribute('style')).toContain('background-color: red');
    expect(row.getAttribute('class')).toContain(customClass);
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();

    customRender(<TableRows {...defaultProps} onClick={handleClick} />);

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);
    expect(handleClick).toHaveBeenCalled();
  });

  it('should call onSelectionChange when clicked', () => {
    const handleSelectionChange = jest.fn();

    customRender(<TableRows {...defaultProps} onSelectionChange={handleSelectionChange} />);

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);
    expect(handleSelectionChange).toHaveBeenCalledWith('row1', true, {
      source: 'row',
    });
  });

  it('should call onSelectionChange with correct state for already selected row', () => {
    const handleSelectionChange = jest.fn();

    customRender(<TableRows {...defaultProps} isSelected={true} onSelectionChange={handleSelectionChange} />);

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);

    expect(handleSelectionChange).toHaveBeenCalledWith('row1', false, {
      source: 'row',
    });
  });

  it('should not call onClick or onSelectionChange if disabled', () => {
    const handleClick = jest.fn();
    const handleSelectionChange = jest.fn();

    customRender(
      <TableRows {...defaultProps} isDisabled={true} onClick={handleClick} onSelectionChange={handleSelectionChange} />,
    );

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);

    expect(handleClick).not.toHaveBeenCalled();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });

  it('should handle drag events', () => {
    const handleDragStart = jest.fn();
    const handleDragEnd = jest.fn();

    customRender(
      <TableRows {...defaultProps} isDraggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />,
    );

    const row = screen.getByTestId('table-row');

    fireEvent.dragStart(row);
    expect(handleDragStart).toHaveBeenCalledTimes(1);

    fireEvent.dragEnd(row);
    expect(handleDragEnd).toHaveBeenCalledTimes(1);
  });

  it('should not handle drag events when disabled', () => {
    const handleDragStart = jest.fn();

    customRender(<TableRows {...defaultProps} isDisabled={true} isDraggable={true} onDragStart={handleDragStart} />);

    const row = screen.getByTestId('table-row');
    fireEvent.dragStart(row);

    expect(handleDragStart).not.toHaveBeenCalled();
  });

  it('should apply selected styling when isSelected is true', () => {
    customRender(<TableRows {...defaultProps} isSelected={true} />);

    const row = screen.getByTestId('table-row');
    expect(row).toBeInTheDocument();
  });

  it('should apply disabled styling when isDisabled is true', () => {
    customRender(<TableRows {...defaultProps} isDisabled={true} />);

    const row = screen.getByTestId('table-row');
    expect(row).toBeInTheDocument();
  });

  it('should pass correct context to column render functions', () => {
    const mockRender = jest.fn().mockReturnValue('Rendered Content');

    const columnsWithMockRender: TableColumnProps<TestRowData>[] = [
      {
        key: 'name',
        header: 'Name',
        isSortable: false,
        render: mockRender,
      },
    ];

    customRender(
      <TableRows
        {...defaultProps}
        columns={columnsWithMockRender}
        isSelected={true}
        isDisabled={false}
        isDraggable={true}
        isSortable={true}
        rowIndex={5}
      />,
    );

    expect(mockRender).toHaveBeenCalledWith(
      mockData,
      expect.objectContaining({
        isSelected: true,
        isRowDisabled: false,
        isRowDraggable: true,
        isSortable: true,
        rowIndex: 5,
        rowId: 'row1', // ✅ Added rowId to context
      }),
    );
  });

  it('should handle keyboard events for accessibility', () => {
    const handleSelectionChange = jest.fn();

    customRender(<TableRows {...defaultProps} onSelectionChange={handleSelectionChange} />);

    const row = screen.getByTestId('table-row');

    // Test Enter key
    fireEvent.keyDown(row, { key: 'Enter' });

    expect(handleSelectionChange).toHaveBeenCalledWith('row1', true, {
      source: 'keyboard',
    });

    // Test Space key
    handleSelectionChange.mockClear();
    fireEvent.keyDown(row, { key: ' ' });

    expect(handleSelectionChange).toHaveBeenCalledWith('row1', true, {
      source: 'keyboard',
    });
  });

  it('should not handle keyboard events when disabled', () => {
    const handleSelectionChange = jest.fn();

    customRender(<TableRows {...defaultProps} isDisabled={true} onSelectionChange={handleSelectionChange} />);

    const row = screen.getByTestId('table-row');

    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });

    expect(handleSelectionChange).not.toHaveBeenCalled();
  });

  it('should render with correct accessibility attributes', () => {
    customRender(<TableRows {...defaultProps} isSelected={true} onSelectionChange={jest.fn()} />);

    const row = screen.getByTestId('table-row');

    expect(row).toBeInTheDocument();
    expect(row.tagName).toBe('TR');

    // ✅ Test for accessibility attributes your component actually sets
    expect(row).toHaveAttribute('role', 'row');
    expect(row).toHaveAttribute('tabIndex', '0');
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row).toHaveAttribute('aria-disabled', 'false');
  });

  it('should set tabIndex to -1 when disabled', () => {
    customRender(<TableRows {...defaultProps} isDisabled={true} />);

    const row = screen.getByTestId('table-row');
    expect(row).toHaveAttribute('tabIndex', '-1');
    expect(row).toHaveAttribute('aria-disabled', 'true');
  });

  it('should handle edge case with missing onSelectionChange', () => {
    // Should not crash when onSelectionChange is not provided
    expect(() => {
      customRender(<TableRows {...defaultProps} />);
      const row = screen.getByTestId('table-row');
      fireEvent.click(row);
    }).not.toThrow();
  });

  it('should handle collapsible content', () => {
    const collapsibleContent = <div>Expanded content</div>;

    customRender(<TableRows {...defaultProps} collapsibleContent={collapsibleContent} />);

    const row = screen.getByTestId('table-row');

    // Initially collapsed
    expect(screen.queryByText('Expanded content')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(row);
    expect(screen.getByText('Expanded content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(row);
    expect(screen.queryByText('Expanded content')).not.toBeInTheDocument();
  });

  it('should prioritize collapsible content over selection when both are present', () => {
    const handleSelectionChange = jest.fn();
    const collapsibleContent = <div>Expanded content</div>;

    customRender(
      <TableRows {...defaultProps} collapsibleContent={collapsibleContent} onSelectionChange={handleSelectionChange} />,
    );

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);

    // Should expand content, not trigger selection
    expect(screen.getByText('Expanded content')).toBeInTheDocument();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });

  it('should render collapsible content with correct test ID', () => {
    const collapsibleContent = <div>Expanded content</div>;

    customRender(
      <TableRows {...defaultProps} collapsibleContent={collapsibleContent} automation-id="custom-test-id" />,
    );

    const row = screen.getByTestId('table-row');
    fireEvent.click(row);

    // Check for collapsible content with proper test ID
    expect(screen.getByTestId('collapsible-content-row')).toBeInTheDocument();
  });

  it('should handle different row heights', () => {
    const { rerender } = customRender(<TableRows {...defaultProps} rowHeight="base" />);

    let row = screen.getByTestId('table-row');
    expect(row).toBeInTheDocument();

    rerender(
      <TableWrapper>
        <TableRows {...defaultProps} rowHeight="condensed" />
      </TableWrapper>,
    );

    row = screen.getByTestId('table-row');
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass('condensed');
  });
});
