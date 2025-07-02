import { renderHook, act } from '@testing-library/react';
import usePagination from '../usePagination';

// Mock data
const testData = Array.from({ length: 25 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Item ${index + 1}`,
}));

describe('usePagination Hook', () => {
  describe('Client-side pagination', () => {
    it('initializes with correct default values', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe('1');
    });

    it('handles page changes correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      act(() => {
        result.current.handleClientPageChange(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe('11');
    });

    it('handles page size changes correctly', async () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      await act(async () => {
        await result.current.handlePageSizeChange(5);
      });

      expect(result.current.pageSize).toBe(5);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.paginatedData).toHaveLength(5);
    });

    it('handles last page with partial data correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      act(() => {
        result.current.handleClientPageChange(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedData).toHaveLength(5); // Last page has 5 items
    });
  });

  describe('Server-side pagination', () => {
    const mockOnPageChange = jest.fn().mockResolvedValue(undefined);
    const serverConfig = {
      enabled: true,
      totalItems: 100,
      onPageChange: mockOnPageChange,
    };

    beforeEach(() => {
      mockOnPageChange.mockClear();
    });

    it('initializes with server-side configuration', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
          serverSide: serverConfig,
        }),
      );

      expect(result.current.totalPages).toBe(10); // 100 items / 10 per page
      expect(result.current.paginatedData).toBe(testData); // Returns full data set
    });

    it('calls server pagination handler on page change', async () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
          serverSide: serverConfig,
        }),
      );

      await act(async () => {
        await result.current.handleServerPageChange(2);
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
      expect(result.current.currentPage).toBe(2);
    });

    it('calls server pagination handler on page size change', async () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
          serverSide: serverConfig,
        }),
      );

      await act(async () => {
        await result.current.handlePageSizeChange(20);
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
      expect(result.current.pageSize).toBe(20);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(5); // 100 items / 20 per page
    });
  });

  describe('Edge cases', () => {
    it('handles invalid page numbers by using minimum valid page', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      act(() => {
        result.current.handleClientPageChange(-1);
      });

      expect(result.current.currentPage).toBe(1); // Should default to page 1
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe('1');
    });

    it('handles page numbers beyond total pages', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      act(() => {
        result.current.handleClientPageChange(999);
      });

      expect(result.current.currentPage).toBe(3); // Should limit to max pages
      expect(result.current.paginatedData).toHaveLength(5);
    });

    it('handles zero or negative page size by using minimum size of 1', async () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 10,
        }),
      );

      await act(async () => {
        await result.current.handlePageSizeChange(0);
      });

      expect(result.current.pageSize).toBe(1);
      expect(result.current.paginatedData).toHaveLength(1);
    });

    it('handles empty data set', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: [],
          initialPageSize: 10,
        }),
      );

      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedData).toHaveLength(0);
    });

    it('handles page size larger than data set', () => {
      const { result } = renderHook(() =>
        usePagination({
          data: testData,
          initialPageSize: 50,
        }),
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(25);
    });
  });
});
