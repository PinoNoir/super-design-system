import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, TableButton, TableCheckbox, TableContainer } from '..';
import Box from '../../box/Box';
import Search from '../../search-input/Search';
import Panel from '../../panel/Panel';
import Button from '../../button/Button';
import { ChapterType, DATABASE, TableRowData, clientToTableFormat } from '../../../database/mockDatabase';
import { useDataSearch, useDataSort, useRowSelection } from '../../../hooks';
import { RenderContext, TableSelectionCallback } from '../types/data-table-generics';

// Mock data passed into the Table
const MOCK_TABLE_DATA: TableRowData[] = DATABASE.CLIENTS.map((client) => ({
  ...clientToTableFormat(client),
}));

// Simplified column creation - no more rowData prop needed
const createColumns = (selectionHandler: TableSelectionCallback<TableRowData>) => [
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
      >
        {context.isSelected ? 'Selected' : 'Select'}
      </TableButton>
    ),
  },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Data Display/Data Table/Selecting Table Rows',
  component: Table,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    'automation-id': {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
    columns: {
      control: { type: 'object' },
    },
    data: {
      control: { type: 'object' },
    },
    onSort: {
      action: 'onSort',
      type: 'function',
    },
    sortDirection: {
      options: ['none', 'ascending', 'descending'],
      control: { type: 'select' },
    },
    sortKey: {
      control: { type: 'text' },
    },
    borderRadius: {
      options: ['none', 'rounded'],
      control: { type: 'select' },
    },
    rowHeight: {
      options: ['base', 'condensed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const DataDrivenSelection: Story = {
  render: function DataDrivenSelection() {
    const tableData = MOCK_TABLE_DATA;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Simplified useRowSelection - no need to pass callback if not needed
    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
      onSelectionChange: (rowId, newState, context) => {
        console.log('Selection changed:', { rowId, newState, source: context.source });
      },
    });

    const columns = createColumns(tableState.handleSelectionChange);

    const { searchTerm, filterData, handleSearch, handleClear } = useDataSearch();
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort();

    const filteredData = useMemo(() => {
      return filterData(tableData);
    }, [tableData, filterData]);

    const processedData = useMemo(() => {
      return sortedData(filteredData);
    }, [filteredData, sortedData]);

    useEffect(() => {
      setCurrentPage(1);
    }, [filteredData.length]);

    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return processedData.slice(start, end);
    }, [processedData, currentPage, pageSize]);

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    };

    const handleSelectAllVisible = (shouldSelectAll: boolean, data: TableRowData[]) => {
      tableState.handleSelectAll(shouldSelectAll, data);
    };

    const selectionHandlers = useMemo(
      () => ({
        handleSelectAll: () => tableState.selectAllRows(tableData),
        handleDeselectAll: () => tableState.deselectAllRows(),
        handleSelectChapter7: () => {
          const chapter7Rows = tableData.filter((row) => row.chapter.includes('Chapter 7'));
          tableState.selectAllRows(chapter7Rows);
        },
        handleSelectChapter13: () => {
          const chapter13Rows = tableData.filter((row) => row.chapter.includes('Chapter 13'));
          tableState.selectAllRows(chapter13Rows);
        },
      }),
      [tableData, tableState],
    );

    return (
      <Panel header="Data Driven Row Selection">
        <Box mb="16">
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search Debtors"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </Box>

        <Box mb="16" display="flex" gap="8" alignItems="center">
          <Box display="flex" flexDirection="row" gap="16">
            <Button variant="primary" onClick={selectionHandlers.handleSelectAll}>
              Select All
            </Button>
            <Button variant="secondary" onClick={selectionHandlers.handleDeselectAll}>
              Deselect All
            </Button>
            <Button variant="secondary" onClick={selectionHandlers.handleSelectChapter7}>
              Select Chapter 7
            </Button>
            <Button variant="secondary" onClick={selectionHandlers.handleSelectChapter13}>
              Select Chapter 13
            </Button>
          </Box>
          <Box>Selected: {tableState.getSelectedCount()} rows</Box>
        </Box>

        <Table
          data={paginatedData}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectionChange={tableState.handleSelectionChange}
          enablePagination={true}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={processedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          enableSelectAll={true}
          isAllSelected={tableState.isAllSelected(paginatedData)}
          onSelectAll={handleSelectAllVisible}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
          borderRadius="rounded"
        />
      </Panel>
    );
  },
};

export const SingleRowSelection: Story = {
  render: function SingleRowSelection() {
    const tableData = MOCK_TABLE_DATA;

    const tableState = useRowSelection<TableRowData>({
      multipleSelect: false,
      onSelectionChange: (rowId, newState, context) => {
        console.log('Single selection:', { rowId, newState, context });
      },
    });

    const columns = createColumns(tableState.handleSelectionChange);

    const { searchTerm, filterData, handleSearch, handleClear } = useDataSearch();
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort();

    const processedData = useMemo(() => {
      const filtered = filterData(tableData);
      return sortedData(filtered);
    }, [tableData, filterData, sortedData]);

    return (
      <TableContainer title="Single Row Selection" description="Table with single row selection">
        <Box mb="16">
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search Debtors"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </Box>

        <Table
          id="single-selection-table"
          automation-id="single-selection-table"
          data={processedData}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectionChange={tableState.handleSelectionChange}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
        />

        <Box mt="16">
          <p>Selected row: {tableState.getSelectedRows(processedData)[0]?.debtor || 'None'}</p>
          <p>Selection count: {tableState.getSelectedCount()}</p>
        </Box>
      </TableContainer>
    );
  },
};

export const CustomSelectionLogic: Story = {
  render: function CustomSelectionLogic() {
    const tableData = MOCK_TABLE_DATA;

    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
    });

    // Custom handler that wraps the hook's handler
    const handleCustomSelection: TableSelectionCallback<TableRowData> = (rowId, newSelectionState, context) => {
      // Look up row data by ID for custom logic
      const rowData = tableData.find((row) => row.id === rowId);

      if (rowData?.disabled) {
        console.log('Cannot select disabled row');
        return;
      }

      if (rowData?.chapter.includes('Chapter 11') && newSelectionState) {
        console.log('Special handling for Chapter 11 cases');
      }

      // Call the hook's handler
      tableState.handleSelectionChange(rowId, newSelectionState, context);
    };

    const columns = createColumns(handleCustomSelection);

    return (
      <TableContainer title="Custom Selection Logic" description="Demonstrates custom selection handling">
        <Table
          data={tableData}
          columns={columns}
          onSelectionChange={handleCustomSelection}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
        />

        <Box mt="16">
          <p>Selected rows: {tableState.getSelectedCount()}</p>
          <Button variant="primary" onClick={() => tableState.clearSelection()}>
            Clear Selection
          </Button>
        </Box>
      </TableContainer>
    );
  },
};

export const WithDataManipulation: Story = {
  render: function WithDataManipulation() {
    // Simplified columns without actions column since it's not needed for this story
    const columns = (selectionHandler: TableSelectionCallback<TableRowData>) => [
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
    ];

    const [tableData, setTableData] = useState<TableRowData[]>(MOCK_TABLE_DATA);

    const tableState = useRowSelection<TableRowData>({
      multipleSelect: true,
    });

    const handleSelectionWithLogging: TableSelectionCallback<TableRowData> = (rowId, newState, context) => {
      console.log('Data manipulation selection:', {
        rowId,
        newState,
        source: context?.source || 'unknown',
        timestamp: Date.now(),
      });
      tableState.handleSelectionChange(rowId, newState, context);
    };

    const addRandomRow = () => {
      const newRow: TableRowData = {
        id: `new-${Date.now()}`,
        caseNumber: `NEW-${Math.floor(Math.random() * 1000)}`,
        debtor: `New Debtor ${Math.floor(Math.random() * 100)}`,
        chapter: ChapterType.Chapter7Individual,
        caseFiledDate: new Date().toLocaleDateString(),
        jointDebtor: '',
        ssn: '',
        disabled: false,
      };
      setTableData((prev) => [...prev, newRow]);
    };

    const removeSelectedRows = () => {
      const selectedIds = tableState.selectedRowIds;
      setTableData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      tableState.clearSelection();
    };

    const resetData = () => {
      setTableData(MOCK_TABLE_DATA);
      tableState.clearSelection();
    };

    return (
      <Panel header="Data Manipulation Example">
        <Box mb="16" display="flex" gap="8">
          <Button variant="primary" onClick={addRandomRow}>
            Add Row
          </Button>
          <Button variant="secondary" onClick={removeSelectedRows} disabled={tableState.getSelectedCount() === 0}>
            Remove Selected ({tableState.getSelectedCount()})
          </Button>
          <Button variant="secondary" onClick={resetData}>
            Reset Data
          </Button>
        </Box>

        <Table
          data={tableData}
          columns={columns(handleSelectionWithLogging)}
          selectedRowIds={tableState.selectedRowIds}
          getIsRowSelected={tableState.isRowSelected}
          onSelectionChange={handleSelectionWithLogging}
        />

        <Box mt="16">
          <p>Total rows: {tableData.length}</p>
          <p>Selected: {tableState.getSelectedCount()}</p>
        </Box>
      </Panel>
    );
  },
};
