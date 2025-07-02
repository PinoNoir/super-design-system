import { Meta, StoryObj } from '@storybook/react-vite';
import Text from '../../text/Text';
import Box from '../../box/Box';
import Search from '../../search-input/Search';
import Panel from '../../panel/Panel';
import Table, { RowRenderer } from '../Table';
import TableRows from '../TableRows';
import { TableColumnProps, RenderContext } from '../types/data-table-generics';
import TableCheckbox from '../TableCheckbox';
import { useDataSearch, useDataSort, useRowSelection } from '../../../hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { clientToTableFormat, DATABASE, TableRowData } from '../../../database/mockDatabase';
import { SuggestionList } from '../../search-input';

const meta: Meta<typeof Table> = {
  title: 'Components/Data Display/Data Table/Customization',
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

// Create mock data at module level
const MOCK_TABLE_DATA = DATABASE.CLIENTS.map((client) => ({
  ...clientToTableFormat(client),
}));

// Sample data interface for custom row examples
interface UserData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  lastLogin: string;
  role: string;
  department: string;
}

// Sample user data
const USER_DATA: UserData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    lastLogin: '2024-01-15',
    role: 'Admin',
    department: 'Engineering',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    lastLogin: '2024-01-14',
    role: 'Developer',
    department: 'Engineering',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    lastLogin: '2024-01-10',
    role: 'Designer',
    department: 'Design',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    lastLogin: '2024-01-16',
    role: 'Developer',
    department: 'Engineering',
  },
];

// Standard columns for custom row examples
const standardColumns: TableColumnProps<UserData>[] = [
  {
    key: 'name',
    header: 'Name',
    isSortable: true,
    render: (data: UserData) => data.name,
  },
  {
    key: 'email',
    header: 'Email',
    isSortable: true,
    render: (data: UserData) => data.email,
  },
  {
    key: 'role',
    header: 'Role',
    isSortable: true,
    render: (data: UserData) => data.role,
  },
  {
    key: 'status',
    header: 'Status',
    isSortable: true,
    render: (data: UserData) => data.status,
  },
];

// 1. CARD-STYLE ROWS
export const CardStyleRows: Story = {
  render: function CardStyleRows() {
    const userData = USER_DATA;
    const tableState = useRowSelection<UserData>({ multipleSelect: true });
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('name');

    const processedData = useMemo(() => {
      return sortedData(userData);
    }, [userData, sortedData]);

    // Custom row renderer for card-style layout
    const cardRowRenderer: RowRenderer<UserData> = (rowData, index, { rowId, isSelected, isDisabled }) => {
      const handleCardClick = () => {
        if (!isDisabled) {
          const newSelectionState = !isSelected;
          tableState.handleSelectionChange(rowId, newSelectionState, { source: 'row' });
        }
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          const newSelectionState = !isSelected;
          tableState.handleSelectionChange(rowId, newSelectionState, { source: 'row' });
        }
      };

      return (
        <tr key={rowId}>
          <td colSpan={standardColumns.length} style={{ padding: '8px' }}>
            <div
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
              style={{
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: isDisabled ? '#f9fafb' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
              onClick={handleCardClick}
              onKeyDown={handleKeyDown}
            >
              <img
                src={rowData.avatar}
                alt={rowData.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid #e5e7eb',
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{rowData.name}</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{rowData.email}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151' }}>
                    {rowData.role} • {rowData.department}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: rowData.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: rowData.status === 'active' ? '#166534' : '#92400e',
                    }}
                  >
                    {rowData.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Last login: {new Date(rowData.lastLogin).toLocaleDateString()}
              </div>
            </div>
          </td>
        </tr>
      );
    };

    return (
      <Panel header="Card Style Rows">
        <Table
          data={processedData}
          columns={standardColumns}
          enablePagination={true}
          enableSelectAll={true}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          isAllSelected={tableState.isAllSelected(processedData)}
          isSomeSelected={tableState.isSomeSelected(processedData)}
          onSelectAll={(shouldSelectAll) => tableState.handleSelectAll(shouldSelectAll, processedData)}
          renderRow={cardRowRenderer}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Box mt="16">
          <Text as="p">Selected: {tableState.getSelectedCount()} cards</Text>
        </Box>
      </Panel>
    );
  },
};

// 2. EXPANDABLE ROWS
export const ExpandableRows: Story = {
  render: function ExpandableRows() {
    const userData = USER_DATA;
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const tableState = useRowSelection<UserData>({ multipleSelect: true });
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('name');

    const processedData = useMemo(() => {
      return sortedData(userData);
    }, [userData, sortedData]);

    const toggleExpanded = (rowId: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      setExpandedRows(newExpanded);
    };

    const expandableRenderRow: RowRenderer<UserData> = (rowData, index, { rowId, isSelected, isDisabled }) => {
      const isExpanded = expandedRows.has(rowId);

      const handleRowClick = () => {
        if (!isDisabled) {
          const newSelectionState = !isSelected;
          tableState.handleSelectionChange(rowId, newSelectionState, { source: 'row' });
        }
      };

      return (
        <React.Fragment key={rowId}>
          {/* Main Row */}
          <tr style={{ cursor: 'pointer', height: 56 }}>
            <td style={{ width: 20, textAlign: 'center' }}>
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(rowId);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Icon
                  icon="mdi:chevron-right"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    fontSize: '24px',
                  }}
                />
              </button>
            </td>
            <td>
              <TableCheckbox rowId={rowId} checked={isSelected} onSelectionChange={tableState.handleSelectionChange} />
            </td>
            <td onClick={handleRowClick}>{rowData.name}</td>
            <td onClick={handleRowClick}>{rowData.email}</td>
            <td onClick={handleRowClick}>{rowData.role}</td>
            <td onClick={handleRowClick}>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: rowData.status === 'active' ? '#dcfce7' : '#fef3c7',
                  color: rowData.status === 'active' ? '#166534' : '#92400e',
                }}
              >
                {rowData.status}
              </span>
            </td>
          </tr>

          {/* Expanded Content */}
          {isExpanded && (
            <tr>
              <td colSpan={6} style={{ backgroundColor: '#f9fafb', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <img
                    src={rowData.avatar}
                    alt={rowData.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{rowData.name}</h4>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>Department:</strong> {rowData.department}
                    </p>
                    <p style={{ margin: '4px 0', color: '#6b7280' }}>
                      <strong>Last Login:</strong> {new Date(rowData.lastLogin).toLocaleDateString()}
                    </p>
                    <div style={{ marginTop: '12px' }}>
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          marginRight: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit user:', rowData.name);
                        }}
                      >
                        Edit User
                      </button>
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View profile:', rowData.name);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    };

    return (
      <Panel header="Expandable Rows Example">
        <Table
          data={processedData}
          columns={[
            { key: 'expand', header: '', width: 40, isSortable: false, render: () => null },
            { key: 'select', header: '', width: 40, isSortable: false, render: () => null },
            ...standardColumns,
          ]}
          renderRow={expandableRenderRow}
          enablePagination={true}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          isAllSelected={tableState.isAllSelected(processedData)}
          isSomeSelected={tableState.isSomeSelected(processedData)}
          onSelectAll={(shouldSelectAll) => tableState.handleSelectAll(shouldSelectAll, processedData)}
          enableSelectAll={true}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Box mt="16">
          <Text as="p">Selected: {tableState.getSelectedCount()} rows</Text>
        </Box>
      </Panel>
    );
  },
};

// 3. HYBRID APPROACH (Custom + Default)
export const HybridApproach: Story = {
  render: function HybridApproach() {
    const userData = USER_DATA;
    const tableState = useRowSelection<UserData>({ multipleSelect: true });
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('name');

    const processedData = useMemo(() => {
      return sortedData(userData);
    }, [userData, sortedData]);

    const hybridRenderer: RowRenderer<UserData> = (rowData, index, { rowId, isSelected, defaultRowProps }) => {
      if (rowData.role === 'Admin') {
        return (
          <tr key={rowId} style={{ backgroundColor: '#fef3c7' }}>
            <td colSpan={standardColumns.length} style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TableCheckbox
                  rowId={rowId}
                  checked={isSelected}
                  onSelectionChange={tableState.handleSelectionChange}
                />
                <span
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ADMIN
                </span>
                <strong>{rowData.name}</strong>
                <span>({rowData.email})</span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#92400e' }}>
                  Special permissions applied
                </span>
              </div>
            </td>
          </tr>
        );
      }

      // Use default TableRows for regular users
      return <TableRows key={rowId} {...defaultRowProps} />;
    };

    return (
      <Panel header="Hybrid Approach">
        <p style={{ marginBottom: '16px', color: '#666' }}>
          This table uses a custom row renderer for Admin users, while using default TableRows for regular users.
        </p>
        <Table
          data={processedData}
          columns={standardColumns}
          enablePagination={true}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          isAllSelected={tableState.isAllSelected(processedData)}
          isSomeSelected={tableState.isSomeSelected(processedData)}
          onSelectAll={(shouldSelectAll) => tableState.handleSelectAll(shouldSelectAll, processedData)}
          renderRow={hybridRenderer}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Box mt="16">
          <Text as="p">Selected: {tableState.getSelectedCount()} users</Text>
        </Box>
      </Panel>
    );
  },
};

// 4. BACKWARD COMPATIBILITY DEMO
export const BackwardCompatibility: Story = {
  render: function BackwardCompatibility() {
    const userData = USER_DATA;
    const tableState = useRowSelection<UserData>({ multipleSelect: true });
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('name');

    const processedData = useMemo(() => {
      return sortedData(userData);
    }, [userData, sortedData]);

    return (
      <Panel header="Backward Compatibility">
        <p style={{ marginBottom: '16px', color: '#666' }}>
          This table uses the exact same props as before - no renderRow prop means default behavior.
        </p>
        <Table
          data={processedData}
          columns={[
            {
              key: 'name',
              header: 'Name',
              isSortable: true,
              render: (data: UserData, context: RenderContext) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={data.avatar}
                    alt={data.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                  />
                  {data.name}
                </div>
              ),
            },
            {
              key: 'email',
              header: 'Email',
              isSortable: true,
              render: (data: UserData) => data.email,
            },
            {
              key: 'role',
              header: 'Role',
              isSortable: true,
              render: (data: UserData) => data.role,
            },
            {
              key: 'status',
              header: 'Status',
              isSortable: true,
              render: (data: UserData) => (
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: data.status === 'active' ? '#dcfce7' : '#fef3c7',
                    color: data.status === 'active' ? '#166534' : '#92400e',
                  }}
                >
                  {data.status}
                </span>
              ),
            },
          ]}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          enablePagination={true}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          isAllSelected={tableState.isAllSelected(processedData)}
          isSomeSelected={tableState.isSomeSelected(processedData)}
          onSelectAll={(shouldSelectAll) => tableState.handleSelectAll(shouldSelectAll, processedData)}
        />

        <Box mt="16">
          <Text as="p">Selected: {tableState.getSelectedCount()} users</Text>
        </Box>
      </Panel>
    );
  },
};

// 5. SIMPLE CUSTOM ROWS WITH MULTI-SELECT
export const SimpleCustomRows: Story = {
  render: function SimpleCustomRows() {
    const tableData = MOCK_TABLE_DATA;
    const tableState = useRowSelection({ multipleSelect: true });
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const { sortedData, handleSort, sortKey, sortDirection } = useDataSort('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Enhanced search with your existing API + new fuzzy features
    const {
      searchTerm,
      debouncedSearchTerm,
      showSuggestions,
      filterData,
      getSuggestions,
      handleSearch,
      handleClear,
      handleSuggestionSelect,
      hasResults,
      setShowSuggestions,
      isUsingFuzzySearch,
    } = useDataSearch({
      enableFuzzySearch: true,
      fuzzyThreshold: 25,
      maxSuggestions: 5,
      searchFields: ['caseNumber', 'debtor', 'chapter'], // Optional: specify fields
      minQueryLengthForFuzzy: 2,
      debounceDelay: 300, // Your existing delay
    });

    // Process data through search and sort (your existing logic)
    const processedData = useMemo(() => {
      const filtered = filterData(tableData);
      return sortedData(filtered);
    }, [tableData, filterData, sortedData]);

    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return processedData.slice(start, end);
    }, [processedData, currentPage, pageSize]);

    // Get search suggestions
    const suggestions = useMemo(() => {
      return getSuggestions(tableData);
    }, [getSuggestions, tableData]);

    // Reset pagination when search changes
    useEffect(() => {
      setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev === null || prev === suggestions.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev === null || prev === 0 ? suggestions.length - 1 : prev - 1));
      } else if (e.key === 'Enter' && highlightedIndex !== null) {
        e.preventDefault();
        handleSuggestionSelect(suggestions[highlightedIndex]);
      }
    };

    // Your existing columns and customRowRenderer code stays exactly the same...
    const simpleColumns = [
      {
        key: 'checkbox',
        header: '',
        width: 40,
        isSortable: false,
        render: () => null,
      },
      {
        key: 'caseNumber',
        header: 'Case Information',
        width: 300,
        isSortable: true,
        render: (data: any) => data.caseNumber,
      },
      {
        key: 'caseFiledDate',
        header: 'Date Filed',
        width: 150,
        isSortable: true,
        render: (data: any) => data.caseFiledDate,
      },
      {
        key: 'chapter',
        header: 'Chapter',
        width: 100,
        isSortable: true,
        render: (data: any) => data.chapter,
      },
    ];

    const customRowRenderer: RowRenderer<any> = (rowData, index, { rowId, isSelected, isDisabled }) => {
      const handleRowClick = (e: React.MouseEvent) => {
        if (
          (e.target as HTMLElement).closest('input[type="checkbox"]') ||
          (e.target as HTMLElement).closest('[data-checkbox-container]')
        ) {
          return;
        }

        if (!isDisabled) {
          const newSelectionState = !isSelected;
          tableState.handleSelectionChange(rowId, newSelectionState, { source: 'row' });
        }
      };

      return (
        <tr
          key={rowId}
          style={{
            backgroundColor: isSelected ? '#e6f6fb' : 'transparent',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
          }}
          onClick={handleRowClick}
        >
          <td className="py-8 px-16" data-checkbox-container>
            <TableCheckbox
              rowId={rowId}
              checked={isSelected}
              disabled={isDisabled}
              onSelectionChange={tableState.handleSelectionChange}
            />
          </td>
          <td className="py-8 px-16">
            <div>
              <Text as="p" className="fw-bold">
                {rowData.caseNumber}
              </Text>
              <Text as="p" className="font-size-sm text-muted">
                {rowData.debtor}
              </Text>
            </div>
          </td>
          <td className="py-8 px-16">
            <Text as="p">{rowData.caseFiledDate}</Text>
          </td>
          <td className="py-8 px-16">
            <Text as="p">{rowData.chapter}</Text>
          </td>
        </tr>
      );
    };

    return (
      <Panel header="Simple Custom Rows with Smart Search">
        <Box mb="16">
          <Text as="p" className="text-muted">
            Enhanced search with fuzzy matching and suggestions. Try typing partial matches!
          </Text>
        </Box>

        <Box mb="16" style={{ position: 'relative' }}>
          <Search
            label="Search Table"
            hideLabel
            placeholder="Search Debtors, Case Numbers, or Chapters"
            type="text"
            value={searchTerm}
            onChange={handleSearch} // Uses your existing handler signature
            onClear={handleClear} // Uses your existing handler
            onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            ariaControls="suggestion-listbox"
            ariaActiveDescendant={highlightedIndex !== null ? `suggestion-${highlightedIndex}` : undefined}
          />

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              <SuggestionList
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onSelect={handleSuggestionSelect}
                onHighlight={setHighlightedIndex}
                id="suggestion-listbox"
              />
            </div>
          )}
        </Box>

        {/* Enhanced no results message */}
        {searchTerm && !hasResults(tableData) && (
          <Box mb="16" p="16" style={{ backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
            <Text as="p" className="text-muted">
              No results found for "{searchTerm}".
              {isUsingFuzzySearch && ' (Using smart search)'}
            </Text>
            {suggestions.length > 0 && (
              <Box mt="8">
                <Text as="p" className="font-size-sm text-muted mb-4">
                  Try these suggestions:
                </Text>
                {suggestions.map((suggestion, index) => (
                  <Text
                    key={suggestion}
                    as="span"
                    size="small"
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      margin: '2px 4px 2px 0',
                      backgroundColor: '#007bff',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </Text>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Table
          data={paginatedData}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          columns={simpleColumns}
          renderRow={customRowRenderer}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          enableSelectAll={true}
          isAllSelected={tableState.isAllSelected(paginatedData)}
          isSomeSelected={tableState.isSomeSelected(paginatedData)}
          onSelectAll={(shouldSelectAll) => tableState.handleSelectAll(shouldSelectAll, paginatedData)}
          enablePagination={true}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={processedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />

        {/* Enhanced Debug Info */}
        <Box mt="16" p="12" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <Text as="h5">Debug Info:</Text>
          <Text as="p" className="font-size-sm">
            Search: "{searchTerm}" (debounced: "{debouncedSearchTerm}") | Using fuzzy:{' '}
            {isUsingFuzzySearch ? 'Yes' : 'No'} | Results: {processedData.length} / {tableData.length}
          </Text>
          <Text as="p" className="font-size-sm">
            Selected:{' '}
            {tableState
              .getSelectedRows(tableData)
              .map((row: any) => row.caseNumber)
              .join(', ') ?? 'None'}
          </Text>
          {suggestions.length > 0 && (
            <Text as="p" className="font-size-sm">
              Suggestions: {suggestions.join(', ')}
            </Text>
          )}
        </Box>
      </Panel>
    );
  },
};

// 6. DRAGGABLE ROWS
export const DraggableRows: Story = {
  render: function DraggableRows() {
    const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
    const tableState = useRowSelection({ multipleSelect: false }); // Single select for drag demo
    const { handleSearch, handleClear, searchTerm, filterData } = useDataSearch();
    const { sortedData } = useDataSort();

    // Process data
    const processedData = useMemo(() => {
      const filtered = filterData(tableData);
      return sortedData(filtered);
    }, [tableData, filterData, sortedData]);

    // Handle row drag
    const handleDragEnd = (oldIndex: number, newIndex: number) => {
      const newData = [...tableData];
      const [draggedItem] = newData.splice(oldIndex, 1);
      newData.splice(newIndex, 0, draggedItem);
      setTableData(newData);
    };

    // Simple columns definition
    const simpleColumns = [
      {
        key: 'caseNumber',
        header: 'Case Number',
        width: 150,
        isSortable: true,
        render: (data: any) => data.caseNumber,
      },
      {
        key: 'debtor',
        header: 'Debtor',
        width: 200,
        isSortable: true,
        render: (data: any) => data.debtor,
      },
      {
        key: 'caseFiledDate',
        header: 'Date Filed',
        width: 150,
        isSortable: true,
        render: (data: any) => data.caseFiledDate,
      },
      {
        key: 'chapter',
        header: 'Chapter',
        width: 100,
        isSortable: true,
        render: (data: any) => data.chapter,
      },
    ];

    return (
      <Panel header="Draggable Rows">
        <Box mb="16">
          <Text as="p" className="text-muted">
            Drag and drop rows to reorder them. Note: Sorting is disabled when dragging is enabled.
          </Text>
        </Box>
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
          data={processedData}
          columns={simpleColumns}
          selectedRowIds={tableState.selectedRowIds}
          onSelectionChange={tableState.handleSelectionChange}
          draggableRows
          onRowDragEnd={handleDragEnd}
        />

        <Box mt="16">
          <Text as="p">
            Selected: {(tableState.getSelectedRows(tableData)[0] as TableRowData)?.caseNumber || 'None'}
          </Text>
        </Box>
      </Panel>
    );
  },
};
