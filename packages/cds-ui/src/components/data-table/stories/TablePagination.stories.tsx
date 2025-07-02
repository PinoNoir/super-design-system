import { useEffect, useState, useMemo } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { SortOrder, Table, TableButton, TableCheckbox, SkeletonTable } from '..';
import Panel from '../../panel/Panel';
import Box from '../../box/Box';
import Button from '../../button/Button';
import Search from '../../search-input/Search';
import { useDataSearch, useDataSort, useRowSelection } from '../../../hooks';
import { clientToTableFormat, DATABASE, generateLargeDataset, TableRowData } from '../../../database/mockDatabase';
import { RenderContext } from '../types/data-table-generics';

// Generate datasets at module level
const MOCK_DATA: TableRowData[] = DATABASE.CLIENTS.map((client) => ({
  ...clientToTableFormat(client),
}));

const LARGE_DATASET: TableRowData[] = generateLargeDataset(1000);

// FIXED: Updated columns to use proper new interface
const createColumns = (selectionHandler: any, multipleSelect: boolean = true) => [
  {
    key: 'select',
    header: '',
    isSortable: false,
    width: 38,
    render: (data: TableRowData, context: RenderContext) => (
      <TableCheckbox rowId={data.id} checked={context.isSelected} onSelectionChange={selectionHandler} />
    ),
  },
  {
    key: 'caseNumber',
    width: 120,
    header: 'Case No.',
    isSortable: true,
    render: (data: TableRowData) => data.caseNumber,
  },
  {
    key: 'debtor',
    header: 'Debtor',
    width: 120,
    isSortable: true,
    render: (data: TableRowData) => data.debtor,
  },
  {
    key: 'chapter',
    header: 'Chapter',
    width: 150,
    isSortable: true,
    render: (data: TableRowData) => data.chapter,
  },
  {
    key: 'caseFiledDate',
    header: 'Date Filed',
    width: 80,
    isSortable: true,
    render: (data: TableRowData) => data.caseFiledDate,
  },
  {
    key: 'actions',
    header: 'Actions',
    width: 100,
    isSortable: false,
    render: (data: TableRowData, context: RenderContext) => (
      <TableButton
        variant={context.isSelected ? 'primary' : 'secondary'}
        rowId={data.id}
        isSelected={context.isSelected}
        onSelectionChange={selectionHandler}
      />
    ),
  },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Data Display/Data Table/Pagination',
  component: Table,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    'automation-id': { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    columns: { control: { type: 'object' } },
    data: { control: { type: 'object' } },
    onSort: { action: 'onSort', type: 'function' },
    sortDirection: {
      options: ['none', 'ascending', 'descending'],
      control: { type: 'select' },
    },
    sortKey: { control: { type: 'text' } },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Mock API call that might fail
let hasSimulatedError = false;

const fetchData = async (
  page: number,
  pageSize: number,
  searchTerm: string,
  sortKey?: string,
  sortDirection?: SortOrder,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let filteredData = [...LARGE_DATASET];

  if (searchTerm.trim()) {
    filteredData = filteredData.filter((item) =>
      Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  if (sortKey && sortDirection && sortDirection !== 'none') {
    filteredData.sort((a, b) => {
      const aValue = a[sortKey as keyof typeof a];
      const bValue = b[sortKey as keyof typeof b];
      const modifier = sortDirection === 'ascending' ? 1 : -1;

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return aValue > bValue ? modifier : aValue < bValue ? -modifier : 0;
    });
  }

  if (!hasSimulatedError) {
    hasSimulatedError = true;
    throw new Error('Simulated one-time error for demonstration.');
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: filteredData.slice(startIndex, endIndex),
    total: filteredData.length,
  };
};

export const ServerSidePagination: Story = {
  render: function ServerSidePagination() {
    // Core state management
    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { searchTerm, handleSearch, handleClear } = useDataSearch();

    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);

    const { handleSort, sortKey, sortDirection } = useDataSort('caseNumber');

    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
    });

    const handleSelectAllVisible = (shouldSelectAll: boolean, data: TableRowData[]) => {
      tableState.handleSelectAll(shouldSelectAll, data);
    };

    const columns = createColumns(tableState.handleSelectionChange, true);

    const loadData = async (
      page = currentPage,
      size = pageSize,
      search = searchTerm,
      sort = sortKey,
      direction = sortDirection,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchData(page, size, search, sort, direction);
        setTableData(response.items);
        setTotalItems(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setTableData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    // Load data when dependencies change
    useEffect(() => {
      loadData(currentPage, pageSize, searchTerm, sortKey, sortDirection);
    }, [currentPage, pageSize, searchTerm, sortKey, sortDirection]);

    // Initialize data on mount
    useEffect(() => {
      loadData(1, pageSize, '', undefined, 'none');
    }, []); // Only run once on mount

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    };

    const handleRetry = () => {
      loadData(currentPage, pageSize, searchTerm, sortKey, sortDirection);
    };

    return (
      <Panel header="Server Side Pagination">
        <Box mb="16">
          <p style={{ color: '#666', marginBottom: '8px' }}>
            Server-side pagination with search, sort, and error handling. Data is processed on the server and only the
            current page is loaded.
          </p>
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search clients (server-side)"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </Box>

        {loading ? (
          <SkeletonTable rows={pageSize} columns={columns.length} />
        ) : (
          <Table
            data={tableData}
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectionChange={tableState.handleSelectionChange}
            selectedRowIds={tableState.selectedRowIds}
            getIsRowSelected={tableState.isRowSelected}
            enablePagination
            enableSelectAll={true}
            isAllSelected={tableState.isAllSelected(tableData)}
            onSelectAll={handleSelectAllVisible}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            serverSide={{
              enabled: true,
              totalItems,
              isLoading: loading,
              error,
              onRetry: handleRetry,
              itemDescription: {
                singular: 'client',
                plural: 'clients',
              },
              pageInfoText: 'Showing {start}-{end} of {total} {items}',
            }}
          />
        )}

        <Box mt="16" p="12" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p>
            <strong>Server-side Status:</strong>
          </p>
          <p>• Selected rows: {tableState.getSelectedCount()}</p>
          <p>• Total items: {totalItems.toLocaleString()}</p>
          <p>• Current page: {currentPage}</p>
          <p>• Page size: {pageSize}</p>
          <p>• Loading: {loading ? 'Yes' : 'No'}</p>
          {error && <p style={{ color: '#dc2626' }}>• Error: {error}</p>}

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="secondary"
              onClick={() => tableState.clearSelection()}
              disabled={tableState.getSelectedCount() === 0}
            >
              Clear Selection
            </Button>
          </div>
        </Box>
      </Panel>
    );
  },
};

export const ClientSidePagination: Story = {
  render: function ClientSidePagination() {
    // All data is stored in client state
    const [tableData] = useState<TableRowData[]>(LARGE_DATASET);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<10 | 25 | 50 | 100>(10);

    // Client-side search and sort hooks
    const { searchTerm, filterData, handleSearch, handleClear } = useDataSearch();
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('caseNumber');

    // Row selection state with proper typing
    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
    });

    const columns = createColumns(tableState.handleSelectionChange, true);

    // Process data through search and sort (client-side)
    const processedData = useMemo(() => {
      const filtered = filterData(tableData);
      return sortedData(filtered);
    }, [tableData, filterData, sortedData]);

    // Paginate the processed data
    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return processedData.slice(startIndex, endIndex);
    }, [processedData, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handlePageSizeChange = (size: 10 | 25 | 50 | 100) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    };

    return (
      <Panel header="Client Side Pagination">
        <Box mb="16">
          <p style={{ color: '#666', marginBottom: '8px' }}>
            Client-side pagination with search and sort. All {LARGE_DATASET.length.toLocaleString()} records are loaded
            in memory and processed locally.
          </p>
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search clients (client-side)"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </Box>

        <Table
          data={paginatedData} // Client provides paginated slice
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          // Updated prop names
          onSelectionChange={tableState.handleSelectionChange}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
          enablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={processedData.length} // Total after filtering
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        <Box mt="16" p="12" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p>
            <strong>Client-side Status:</strong>
          </p>
          <p>• Selected rows: {tableState.getSelectedCount()}</p>
          <p>• Total records: {tableData.length.toLocaleString()}</p>
          <p>• Filtered records: {processedData.length.toLocaleString()}</p>
          <p>
            • Showing: {paginatedData.length} of {processedData.length}
          </p>
          <p>• Current page: {currentPage}</p>
          <p>• Page size: {pageSize}</p>

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="secondary"
              onClick={() => tableState.clearSelection()}
              disabled={tableState.getSelectedCount() === 0}
            >
              Clear Selection
            </Button>
          </div>
        </Box>
      </Panel>
    );
  },
};

export const NoPagination: Story = {
  render: function NoPagination() {
    const [tableData] = useState<TableRowData[]>(MOCK_DATA);

    // Client-side search and sort
    const { searchTerm, filterData, handleSearch, handleClear } = useDataSearch();
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('debtor');

    // FIXED: Row selection state with proper typing
    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
    });

    const columns = createColumns(tableState.handleSelectionChange, true);

    // Process all data without pagination
    const processedData = useMemo(() => {
      const filtered = filterData(tableData);
      return sortedData(filtered);
    }, [tableData, filterData, sortedData]);

    return (
      <Panel header="No Pagination">
        <Box mb="16">
          <p style={{ color: '#666', marginBottom: '8px' }}>
            All data displayed without pagination. Suitable for smaller datasets.
          </p>
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search clients"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </Box>

        <Table
          data={processedData}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectionChange={tableState.handleSelectionChange}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
          enableSelectAll={false} // Explicitly disable select all
          enablePagination={false} // Explicitly disable pagination
        />

        <Box mt="16" p="12" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p>
            <strong>No Pagination Status:</strong>
          </p>
          <p>• Selected rows: {tableState.getSelectedCount()}</p>
          <p>• Total records: {tableData.length}</p>
          <p>• Filtered records: {processedData.length}</p>
          <p>• All data displayed at once</p>

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="secondary"
              onClick={() => tableState.clearSelection()}
              disabled={tableState.getSelectedCount() === 0}
            >
              Clear Selection
            </Button>
          </div>
        </Box>
      </Panel>
    );
  },
};
