import { render, screen, fireEvent } from '@testing-library/react';

import TableHeader from '../TableHeader';

// Mock Icon component
jest.mock('@iconify/react', () => ({
  Icon: ({ className, icon, width, ...props }) => <div automation-id="mock-icon" {...props} />,
}));

const TableWrapper = ({ children }) => <table>{children}</table>;

const mockColumns = [
  { key: 'name', header: 'Name', isSortable: true, width: 100 },
  { key: 'age', header: 'Age', isSortable: false, width: 100 },
  { key: 'email', header: 'Email', isSortable: true, width: 100 },
];

describe('TableHeader', () => {
  const mockOnSort = jest.fn();
  const mockOnSelectAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = (ui) => {
    return render(ui, {
      wrapper: TableWrapper,
    });
  };
  const mockColumnsWithRender = [
    { key: 'name', header: 'Name', isSortable: true, width: 100, render: () => null },
    { key: 'age', header: 'Age', isSortable: false, width: 100, render: () => null },
    { key: 'email', header: 'Email', isSortable: true, width: 100, render: () => null },
  ];

  it('renders all column headers', () => {
    customRender(<TableHeader columns={mockColumnsWithRender} />);
    mockColumnsWithRender.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });
  });

  it('renders sort buttons for sortable columns only', () => {
    customRender(<TableHeader columns={mockColumnsWithRender} onSort={mockOnSort} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // Only Name and Email are sortable
  });

  it('calls onSort with correct key when sorting column is clicked', () => {
    customRender(<TableHeader columns={mockColumnsWithRender} onSort={mockOnSort} />);
    fireEvent.click(screen.getByText('Name'));
    expect(mockOnSort).toHaveBeenCalledWith('name');
  });

  it('renders select all checkbox when enable is true', () => {
    customRender(
      <TableHeader
        columns={mockColumnsWithRender}
        enableSelectAll={true}
        onSelectAll={mockOnSelectAll}
        isAllSelected={false}
      />,
    );

    const checkbox = screen.getByLabelText('Select all rows');
    expect(checkbox).toBeInTheDocument();
  });

  it('calls onSelectAll when checkbox is clicked', () => {
    customRender(
      <TableHeader
        columns={mockColumnsWithRender}
        enableSelectAll={true}
        onSelectAll={mockOnSelectAll}
        isAllSelected={false}
      />,
    );

    const checkbox = screen.getByLabelText('Select all rows');
    fireEvent.click(checkbox);
    expect(mockOnSelectAll).toHaveBeenCalled();
  });

  it('shows correct sort direction icon state', () => {
    const { rerender } = customRender(
      <TableHeader columns={mockColumnsWithRender} sortKey="name" sortDirection="ascending" onSort={jest.fn()} />,
    );

    const icon = screen.getAllByTestId('mock-icon')[0];
    expect(icon).toHaveAttribute('data-state', 'ascending');

    rerender(
      <TableHeader columns={mockColumnsWithRender} sortKey="name" sortDirection="descending" onSort={jest.fn()} />,
    );

    expect(icon).toHaveAttribute('data-state', 'descending');
  });

  it('applies custom width to columns when specified', () => {
    const columnsWithWidth = [{ ...mockColumnsWithRender[0], width: 100 }];
    customRender(<TableHeader columns={columnsWithWidth} />);
    const header = screen.getByRole('columnheader');
    expect(header).toHaveStyle({ width: '100px' });
  });

  it('correctly handles select all checkbox state transitions', () => {
    const { rerender } = customRender(
      <TableHeader
        columns={mockColumnsWithRender}
        enableSelectAll={true}
        onSelectAll={mockOnSelectAll}
        isAllSelected={false}
      />,
    );

    const checkbox = screen.getByLabelText('Select all rows');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(mockOnSelectAll).toHaveBeenCalled();

    rerender(
      <TableHeader
        columns={mockColumnsWithRender}
        enableSelectAll={true}
        onSelectAll={mockOnSelectAll}
        isAllSelected={true}
      />,
    );

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(mockOnSelectAll).toHaveBeenCalled();
  });
});
