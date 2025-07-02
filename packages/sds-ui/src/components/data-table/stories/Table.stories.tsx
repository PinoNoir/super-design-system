import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, TableButton, TableCheckbox } from '..';
import Box from '../../box/Box';
import Search from '../../search-input/Search';
import Panel from '../../panel/Panel';
import { DATABASE, TableRowData, clientToTableFormat } from '../../../database/mockDatabase';
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
  title: 'Components/Data Display/Data Table/Basic Table Configuration',
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

export const BasicTableWithSearchAndSort: Story = {
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

    return (
      <Panel header="Basic table with search, sort, and client side pagination">
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
          rowHeight="condensed"
        />
      </Panel>
    );
  },
};