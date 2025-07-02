import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import styles from './styles/DataTablePagination.module.css';
import { MenuItem, Select } from '../select';
import { useId } from '../../utilities/use-id';

export interface PaginationProps {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void | Promise<void>;
  onPageSizeChange: (pageSize: number) => void | Promise<void>;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  itemDescription?: { singular: string; plural: string } | string;
  pageInfoText?: string;
  serverSide?: boolean;
}

const Pagination = ({
  pageSize,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  isLoading = false,
  itemDescription = { singular: 'item', plural: 'items' },
  pageInfoText,
  serverSide = false,
}: PaginationProps) => {
  const uniqueId = useId();

  const safePageSize = Math.max(1, pageSize);
  const safeTotalPages = Math.max(0, totalPages);
  const safeCurrentPage = Math.max(1, currentPage);

  // Fix: Use a different variable name and properly reference the prop
  const actualTotalItems = totalItems ?? safeTotalPages * safePageSize;
  const startItem = actualTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, actualTotalItems);

  const getItemDescription = (count: number) => {
    if (typeof itemDescription === 'string') return itemDescription;
    return count === 1 ? itemDescription.singular : itemDescription.plural;
  };

  const defaultPageInfoText = serverSide
    ? 'Showing {start}-{end} of {total} {items}'
    : 'Showing {currentPage} of {totalPages} pages';

  const pageInfo = (pageInfoText ?? defaultPageInfoText)
    .replace('{start}', startItem.toString())
    .replace('{end}', endItem.toString())
    .replace('{total}', actualTotalItems.toString())
    .replace('{items}', getItemDescription(actualTotalItems))
    .replace('{item}', getItemDescription(1))
    .replace('{currentPage}', safeCurrentPage.toString())
    .replace('{totalPages}', safeTotalPages.toString());

  const visiblePages = useMemo(() => {
    const delta = 2;
    const pages: (number | string)[] = [];

    // Handle edge case where there are no pages
    if (safeTotalPages <= 0) return pages;

    pages.push(1);
    let rangeStart = Math.max(2, safeCurrentPage - delta);
    let rangeEnd = Math.min(safeTotalPages - 1, safeCurrentPage + delta);

    if (safeCurrentPage <= delta + 1) {
      rangeEnd = Math.min(safeTotalPages - 1, 2 * delta + 1);
    } else if (safeCurrentPage >= safeTotalPages - delta) {
      rangeStart = Math.max(2, safeTotalPages - 2 * delta);
    }

    if (rangeStart > 2) pages.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < safeTotalPages - 1) pages.push('...');
    if (safeTotalPages > 1) pages.push(safeTotalPages);

    return pages;
  }, [safeCurrentPage, safeTotalPages]);

  const handlePageChange = async (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
    if (page < 1 || page > safeTotalPages || isLoading) return;
    await onPageChange(event, page);
  };

  const handlePageSizeChange = async (event: { target: { value: string } }) => {
    const newSize = Number(event.target.value);
    if (newSize < 1 || isLoading) return;
    await onPageSizeChange(newSize);
  };

  // Don't render pagination if there are no pages
  if (safeTotalPages <= 0) {
    return null;
  }

  return (
    <nav className={styles.paginationWrapper} automation-id="pagination">
      <div className={styles.pageList}>
        <span className={styles.pageInfo}>{pageInfo}</span>
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={(e) => handlePageChange(e, 1)}
          disabled={safeCurrentPage === 1 || isLoading}
          automation-id="first-page"
          aria-label="Go to first page"
        >
          <Icon icon="mdi:chevron-double-left" />
        </button>
        <button
          className={styles.paginationButton}
          onClick={(e) => handlePageChange(e, safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1 || isLoading}
          automation-id="prev-page"
          aria-label="Go to previous page"
        >
          <Icon icon="mdi:chevron-left" />
        </button>

        {visiblePages.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${currentPage}-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              className={clsx(styles.pageNumbers, {
                [styles.activePage]: safeCurrentPage === page,
              })}
              onClick={(e) => handlePageChange(e, page as number)}
              disabled={isLoading}
            >
              {page}
            </button>
          ),
        )}

        <button
          className={styles.paginationButton}
          onClick={(e) => handlePageChange(e, safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages || isLoading}
          automation-id="next-page"
          aria-label="Go to next page"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
        <button
          className={styles.paginationButton}
          onClick={(e) => handlePageChange(e, safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages || isLoading}
          automation-id="last-page"
          aria-label="Go to last page"
        >
          <Icon icon="mdi:chevron-double-right" />
        </button>

        <div className={styles.selectContainer}>
          <Select
            value={safePageSize}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
            disabled={isLoading}
            variant="pagination"
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={`${uniqueId}-${size}`} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;
