import React, { useCallback } from 'react';
import { ServerSideConfig } from '../components/data-table/types/data-table-generics';

interface UsePaginationProps<T> {
  data: T[];
  initialPageSize: number;
  serverSide?: ServerSideConfig;
  resetPageOnPageSizeChange?: boolean;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  paginatedData: T[];
  totalPages: number;
  handleClientPageChange: (page: number) => void;
  handleServerPageChange: (page: number) => Promise<void>;
  handlePageSizeChange: (pageSize: number) => Promise<void>;
}

const usePagination = <T>({
  data,
  initialPageSize,
  serverSide,
  resetPageOnPageSizeChange = true,
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(Math.max(1, initialPageSize));

  const totalItems = serverSide?.enabled ? (serverSide.totalItems ?? 0) : data.length;

  const totalPages = React.useMemo(() => {
    return Math.ceil(totalItems / Math.max(1, pageSize));
  }, [totalItems, pageSize]);

  const paginatedData = React.useMemo(() => {
    if (serverSide?.enabled) return data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return startIndex >= data.length ? [] : data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, serverSide?.enabled]);

  const handleClientPageChange = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    },
    [currentPage, totalPages],
  );

  const handleServerPageChange = useCallback(
    async (page: number) => {
      if (serverSide?.onPageChange) {
        const validPage = Math.max(1, Math.min(page, totalPages));
        if (validPage !== currentPage) {
          await serverSide.onPageChange(validPage);
          setCurrentPage(validPage);
        }
      }
    },
    [currentPage, totalPages, serverSide],
  );

  const handlePageSizeChange = useCallback(
    async (newSize: number) => {
      const validSize = Math.max(1, newSize);
      if (validSize !== pageSize) {
        setPageSize(validSize);
        const newPage = resetPageOnPageSizeChange ? 1 : currentPage;
        setCurrentPage(newPage);

        if (serverSide?.enabled && serverSide.onPageChange) {
          await serverSide.onPageChange(newPage);
        }
      }
    },
    [pageSize, currentPage, resetPageOnPageSizeChange, serverSide],
  );

  return {
    currentPage,
    pageSize,
    paginatedData,
    totalPages,
    handleClientPageChange,
    handleServerPageChange,
    handlePageSizeChange,
  };
};

export default usePagination;
