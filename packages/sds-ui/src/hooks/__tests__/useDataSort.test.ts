import { renderHook, act } from '@testing-library/react';
import useDataSort from '../useDataSort';

// Test data interfaces
interface TestUser {
  id: number;
  name: string;
  age: number;
  email: string;
  isActive: boolean;
  joinDate: string;
  salary?: number;
  department?: string;
}

interface TestProduct {
  id: string;
  title: string;
  price: string; // Numeric string
  rating: number;
  releaseDate: Date;
  inStock: boolean;
  category: null | string;
}

// Mock data sets
const mockUsers: TestUser[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    age: 28,
    email: 'alice@example.com',
    isActive: true,
    joinDate: '2022-01-15',
    salary: 75000,
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Bob Smith',
    age: 35,
    email: 'bob@example.com',
    isActive: false,
    joinDate: '2021-08-22',
    salary: 82000,
    department: 'Marketing',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    age: 22,
    email: 'charlie@example.com',
    isActive: true,
    joinDate: '2023-03-10',
    salary: 65000,
    department: 'Engineering',
  },
  {
    id: 4,
    name: 'Diana Prince',
    age: 31,
    email: 'diana@example.com',
    isActive: true,
    joinDate: '2020-11-05',
    department: 'Design',
  }, // No salary
  {
    id: 5,
    name: 'Eve Wilson',
    age: 29,
    email: 'eve@example.com',
    isActive: false,
    joinDate: '2022-07-18',
    salary: 78000,
  }, // No department
];

const mockProducts: TestProduct[] = [
  {
    id: 'p1',
    title: 'Widget A',
    price: '29.99',
    rating: 4.5,
    releaseDate: new Date('2023-01-15'),
    inStock: true,
    category: 'Electronics',
  },
  {
    id: 'p2',
    title: 'Gadget B',
    price: '149.50',
    rating: 3.8,
    releaseDate: new Date('2022-11-20'),
    inStock: false,
    category: 'Home',
  },
  {
    id: 'p3',
    title: 'Tool C',
    price: '89.00',
    rating: 4.9,
    releaseDate: new Date('2023-06-01'),
    inStock: true,
    category: null,
  },
  {
    id: 'p4',
    title: 'Device D',
    price: '199.99',
    rating: 4.2,
    releaseDate: new Date('2023-03-10'),
    inStock: true,
    category: 'Electronics',
  },
];

const emptyArray: TestUser[] = [];

describe('useDataSort Hook', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useDataSort());

      expect(result.current.sortKey).toBe('');
      expect(result.current.sortDirection).toBe('none');
      expect(result.current.hasSorted).toBe(false);
    });

    it('should initialize with provided default sort key', () => {
      const { result } = renderHook(() => useDataSort('name'));

      expect(result.current.sortKey).toBe('name');
      expect(result.current.sortDirection).toBe('none');
      expect(result.current.hasSorted).toBe(false);
    });

    it('should return unsorted data when not sorted yet', () => {
      const { result } = renderHook(() => useDataSort());

      const sortedData = result.current.sortedData(mockUsers);
      expect(sortedData).toEqual(mockUsers);
      expect(sortedData).toBe(mockUsers); // Should be same reference
    });
  });

  describe('Basic Sorting Functionality', () => {
    it('should sort by string field ascending on first click', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortKey).toBe('name');
      expect(result.current.sortDirection).toBe('ascending');
      expect(result.current.hasSorted).toBe(true);

      const sortedData = result.current.sortedData(mockUsers);
      const names = sortedData.map((user) => user.name);
      expect(names).toEqual(['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson']);
    });

    it('should toggle to descending on second click of same field', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortDirection).toBe('descending');

      const sortedData = result.current.sortedData(mockUsers);
      const names = sortedData.map((user) => user.name);
      expect(names).toEqual(['Eve Wilson', 'Diana Prince', 'Charlie Brown', 'Bob Smith', 'Alice Johnson']);
    });

    it('should reset to ascending when clicking different field', () => {
      const { result } = renderHook(() => useDataSort());

      // Sort by name descending
      act(() => {
        result.current.handleSort('name');
      });
      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortDirection).toBe('descending');

      // Sort by age - should reset to ascending
      act(() => {
        result.current.handleSort('age');
      });

      expect(result.current.sortKey).toBe('age');
      expect(result.current.sortDirection).toBe('ascending');

      const sortedData = result.current.sortedData(mockUsers);
      const ages = sortedData.map((user) => user.age);
      expect(ages).toEqual([22, 28, 29, 31, 35]);
    });
  });

  describe('Data Type Specific Sorting', () => {
    describe('Number Sorting', () => {
      it('should sort numbers correctly', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('age');
        });

        const sortedData = result.current.sortedData(mockUsers);
        const ages = sortedData.map((user) => user.age);
        expect(ages).toEqual([22, 28, 29, 31, 35]);

        // Test descending
        act(() => {
          result.current.handleSort('age');
        });

        const descendingSorted = result.current.sortedData(mockUsers);
        const descendingAges = descendingSorted.map((user) => user.age);
        expect(descendingAges).toEqual([35, 31, 29, 28, 22]);
      });

      it('should handle optional number fields with null/undefined values', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('salary');
        });

        const sortedData = result.current.sortedData(mockUsers);
        const salaries = sortedData.map((user) => user.salary);
        // Null/undefined values should come last in ascending order
        expect(salaries).toEqual([65000, 75000, 78000, 82000, undefined]);
      });
    });

    describe('Numeric String Sorting', () => {
      it('should sort numeric strings as numbers', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('price');
        });

        const sortedData = result.current.sortedData(mockProducts);
        const prices = sortedData.map((product) => product.price);
        expect(prices).toEqual(['29.99', '89.00', '149.50', '199.99']);
      });
    });

    describe('Boolean Sorting', () => {
      it('should sort boolean values correctly', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('isActive');
        });

        const sortedData = result.current.sortedData(mockUsers);
        const activeStates = sortedData.map((user) => user.isActive);
        // False values should come before true values in ascending
        expect(activeStates).toEqual([false, false, true, true, true]);
      });
    });

    describe('Date Sorting', () => {
      it('should sort Date objects correctly', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('releaseDate');
        });

        const sortedData = result.current.sortedData(mockProducts);
        const dates = sortedData.map((product) => product.releaseDate.getTime());

        // Should be in chronological order
        expect(dates[0]).toBeLessThan(dates[1]);
        expect(dates[1]).toBeLessThan(dates[2]);
        expect(dates[2]).toBeLessThan(dates[3]);
      });

      it('should sort date strings correctly', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('joinDate');
        });

        const sortedData = result.current.sortedData(mockUsers);
        const joinDates = sortedData.map((user) => user.joinDate);
        expect(joinDates).toEqual(['2020-11-05', '2021-08-22', '2022-01-15', '2022-07-18', '2023-03-10']);
      });
    });

    describe('String Sorting', () => {
      it('should sort strings with locale-aware comparison', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('email');
        });

        const sortedData = result.current.sortedData(mockUsers);
        const emails = sortedData.map((user) => user.email);
        expect(emails).toEqual([
          'alice@example.com',
          'bob@example.com',
          'charlie@example.com',
          'diana@example.com',
          'eve@example.com',
        ]);
      });

      it('should handle string fields with null values', () => {
        const { result } = renderHook(() => useDataSort());

        act(() => {
          result.current.handleSort('category');
        });

        const sortedData = result.current.sortedData(mockProducts);
        const categories = sortedData.map((product) => product.category);
        // Null values should come last
        expect(categories).toEqual(['Electronics', 'Electronics', 'Home', null]);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty arrays', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      const sortedData = result.current.sortedData(emptyArray);
      expect(sortedData).toEqual([]);
    });

    it('should handle invalid sort keys gracefully', () => {
      const { result } = renderHook(() => useDataSort());

      // Should not crash with invalid keys
      act(() => {
        result.current.handleSort('');
      });

      expect(result.current.sortKey).toBe('');
      expect(result.current.hasSorted).toBe(false);

      act(() => {
        result.current.handleSort('nonExistentField');
      });

      expect(result.current.sortKey).toBe('nonExistentField');
      expect(result.current.hasSorted).toBe(true);

      // Should return data unchanged when field doesn't exist
      const sortedData = result.current.sortedData(mockUsers);
      expect(sortedData).toEqual(mockUsers);
    });

    it('should handle objects without the sort key', () => {
      const dataWithMissingFields = [
        { id: 1, name: 'Alice' },
        { id: 2 }, // Missing name field
        { id: 3, name: 'Charlie' },
      ];

      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      const sortedData = result.current.sortedData(dataWithMissingFields);
      // Should not crash and maintain array length
      expect(sortedData).toHaveLength(3);
    });

    it('should handle mixed data types in the same field', () => {
      const mixedData = [
        { id: 1, value: 'string' },
        { id: 2, value: 42 },
        { id: 3, value: true },
        { id: 4, value: null },
      ];

      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('value');
      });

      // Should not crash with mixed types
      expect(() => {
        result.current.sortedData(mixedData);
      }).not.toThrow();
    });

    it('should maintain original array immutability', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      const originalData = [...mockUsers];
      const sortedData = result.current.sortedData(mockUsers);

      // Original array should be unchanged
      expect(mockUsers).toEqual(originalData);
      // Sorted data should be a new array
      expect(sortedData).not.toBe(mockUsers);
    });
  });

  describe('Manual Sort Direction Control', () => {
    it('should allow manual sort direction setting', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
        result.current.setSortDirection('descending');
      });

      expect(result.current.sortDirection).toBe('descending');

      const sortedData = result.current.sortedData(mockUsers);
      const names = sortedData.map((user) => user.name);
      expect(names).toEqual(['Eve Wilson', 'Diana Prince', 'Charlie Brown', 'Bob Smith', 'Alice Johnson']);
    });

    it('should reset to none when manually set', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.hasSorted).toBe(true);

      act(() => {
        result.current.setSortDirection('none');
      });

      expect(result.current.sortDirection).toBe('none');

      // Should return original order when direction is none
      const sortedData = result.current.sortedData(mockUsers);
      expect(sortedData).toEqual(mockUsers);
    });
  });

  describe('Performance and Stability', () => {
    it('should maintain referential stability of functions', () => {
      const { result, rerender } = renderHook(() => useDataSort());

      const firstSortedData = result.current.sortedData;
      const firstHandleSort = result.current.handleSort;
      const firstSetSortDirection = result.current.setSortDirection;

      rerender();

      expect(result.current.sortedData).toBe(firstSortedData);
      expect(result.current.handleSort).toBe(firstHandleSort);
      expect(result.current.setSortDirection).toBe(firstSetSortDirection);
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        value: Math.random() * 100,
        category: i % 2 === 0 ? 'A' : 'B',
      }));

      const { result } = renderHook(() => useDataSort());

      const startTime = performance.now();

      act(() => {
        result.current.handleSort('value');
      });

      const sortedData = result.current.sortedData(largeDataset);
      const endTime = performance.now();

      // Should complete in reasonable time (less than 100ms for 1000 items)
      expect(endTime - startTime).toBeLessThan(100);
      expect(sortedData).toHaveLength(1000);

      // Verify it's actually sorted
      for (let i = 1; i < sortedData.length; i++) {
        expect(sortedData[i].value).toBeGreaterThanOrEqual(sortedData[i - 1].value);
      }
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with complex sorting sequences', () => {
      const { result } = renderHook(() => useDataSort());

      // Sort by name ascending
      act(() => {
        result.current.handleSort('name');
      });

      let sortedData = result.current.sortedData(mockUsers);
      expect(sortedData[0].name).toBe('Alice Johnson');
      expect(result.current.sortDirection).toBe('ascending');

      // Switch to age - first click should be ascending
      act(() => {
        result.current.handleSort('age');
      });

      sortedData = result.current.sortedData(mockUsers);
      expect(sortedData[0].age).toBe(22); // Youngest first (ascending)
      expect(result.current.sortDirection).toBe('ascending');

      // Second click on age should be descending
      act(() => {
        result.current.handleSort('age');
      });

      sortedData = result.current.sortedData(mockUsers);
      expect(sortedData[0].age).toBe(35); // Oldest first (descending)
      expect(result.current.sortDirection).toBe('descending');

      // Back to name ascending (new field, so resets to ascending)
      act(() => {
        result.current.handleSort('name');
      });

      sortedData = result.current.sortedData(mockUsers);
      expect(sortedData[0].name).toBe('Alice Johnson');
      expect(result.current.sortDirection).toBe('ascending');
    });

    it('should handle dynamic data updates', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      // Sort original data
      let sortedData = result.current.sortedData(mockUsers);
      expect(sortedData[0].name).toBe('Alice Johnson');

      // Add new user and sort again
      const updatedUsers = [
        ...mockUsers,
        { id: 6, name: 'Aaron First', age: 25, email: 'aaron@example.com', isActive: true, joinDate: '2023-01-01' },
      ];

      sortedData = result.current.sortedData(updatedUsers);
      expect(sortedData[0].name).toBe('Aaron First'); // Should be first alphabetically
      expect(sortedData).toHaveLength(6);
    });
  });

  describe('Type Safety and Generics', () => {
    it('should work with different data types', () => {
      const { result } = renderHook(() => useDataSort());

      // Test with products
      act(() => {
        result.current.handleSort('title');
      });

      const sortedProducts = result.current.sortedData(mockProducts);
      expect(sortedProducts[0].title).toBe('Device D');

      // Test with users (different type)
      const sortedUsers = result.current.sortedData(mockUsers);
      expect(sortedUsers[0].name).toBe('Alice Johnson'); // Since we sorted by 'title' which doesn't exist in users
    });

    it('should maintain type safety in returned data', () => {
      const { result } = renderHook(() => useDataSort());

      act(() => {
        result.current.handleSort('name');
      });

      const sortedData = result.current.sortedData(mockUsers);

      // TypeScript should infer correct types
      expect(typeof sortedData[0].id).toBe('number');
      expect(typeof sortedData[0].name).toBe('string');
      expect(typeof sortedData[0].isActive).toBe('boolean');
    });
  });
});
