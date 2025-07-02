import { renderHook, act, waitFor } from '@testing-library/react';
import useDataSearch from '../useDataSearch';

// Test data types
interface TestUser {
  id: string;
  name: string;
  email: string;
  age: number;
  action?: string;
  department?: string | null;
  isActive?: boolean;
}

const mockUsers: TestUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
    department: 'Engineering',
    isActive: true,
    action: 'edit',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    age: 25,
    department: 'Marketing',
    isActive: true,
    action: 'delete',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@test.org',
    age: 35,
    department: null,
    isActive: false,
    action: 'view',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@demo.net',
    age: 28,
    department: 'Engineering',
    isActive: true,
    action: 'edit',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@wilson.com',
    age: 42,
    department: 'Sales',
    isActive: false,
    action: 'archive',
  },
];

// Mock timers for debounce testing
jest.useFakeTimers();

describe('useDataSearch Hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('initializes with empty search term', () => {
      const { result } = renderHook(() => useDataSearch());

      expect(result.current.searchTerm).toBe('');
      expect(result.current.debouncedSearchTerm).toBe('');
    });

    it('provides all required functions and properties', () => {
      const { result } = renderHook(() => useDataSearch());

      expect(result.current).toHaveProperty('searchTerm');
      expect(result.current).toHaveProperty('debouncedSearchTerm');
      expect(result.current).toHaveProperty('filterData');
      expect(result.current).toHaveProperty('handleSearch');
      expect(result.current).toHaveProperty('handleClear');

      expect(typeof result.current.filterData).toBe('function');
      expect(typeof result.current.handleSearch).toBe('function');
      expect(typeof result.current.handleClear).toBe('function');
    });
  });

  describe('Search Term Management', () => {
    it('updates search term immediately when handleSearch is called', () => {
      const { result } = renderHook(() => useDataSearch());

      const mockEvent = {
        target: { value: 'john' } as HTMLInputElement,
        type: 'change' as const,
      };

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.searchTerm).toBe('john');
      // Debounced term should still be empty immediately
      expect(result.current.debouncedSearchTerm).toBe('');
    });

    it('clears search term when handleClear is called', () => {
      const { result } = renderHook(() => useDataSearch());

      // First set a search term
      const mockEvent = {
        target: { value: 'test' } as HTMLInputElement,
        type: 'change' as const,
      };

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.searchTerm).toBe('test');

      // Then clear it
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('handles multiple rapid search term changes', () => {
      const { result } = renderHook(() => useDataSearch());

      const createEvent = (value: string) => ({
        target: { value } as HTMLInputElement,
        type: 'change' as const,
      });

      act(() => {
        result.current.handleSearch(createEvent('a'));
      });
      act(() => {
        result.current.handleSearch(createEvent('ab'));
      });
      act(() => {
        result.current.handleSearch(createEvent('abc'));
      });

      expect(result.current.searchTerm).toBe('abc');
      expect(result.current.debouncedSearchTerm).toBe('');
    });
  });

  describe('Debouncing Functionality', () => {
    it('debounces search term updates with 300ms delay', async () => {
      const { result } = renderHook(() => useDataSearch());

      const mockEvent = {
        target: { value: 'john' } as HTMLInputElement,
        type: 'change' as const,
      };

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.searchTerm).toBe('john');
      expect(result.current.debouncedSearchTerm).toBe('');

      // Fast-forward time by 300ms
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.debouncedSearchTerm).toBe('john');
      });
    });

    it('cancels previous timeout when new search is made within debounce period', async () => {
      const { result } = renderHook(() => useDataSearch());

      const createEvent = (value: string) => ({
        target: { value } as HTMLInputElement,
        type: 'change' as const,
      });

      act(() => {
        result.current.handleSearch(createEvent('jo'));
      });

      // Wait 200ms (less than debounce delay)
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.debouncedSearchTerm).toBe('');

      // Add more characters
      act(() => {
        result.current.handleSearch(createEvent('john'));
      });

      // Wait another 200ms (total 400ms from first search, but only 200ms from second)
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.debouncedSearchTerm).toBe('');

      // Wait the remaining 100ms to complete the 300ms from the second search
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.debouncedSearchTerm).toBe('john');
      });
    });

    it('updates debounced term when clearing search', async () => {
      const { result } = renderHook(() => useDataSearch());

      // Set initial search term
      const mockEvent = {
        target: { value: 'test' } as HTMLInputElement,
        type: 'change' as const,
      };

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.debouncedSearchTerm).toBe('test');
      });

      // Clear search
      act(() => {
        result.current.handleClear();
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.debouncedSearchTerm).toBe('');
      });
    });
  });

  describe('Data Filtering', () => {
    it('returns all data when search term is empty', () => {
      const { result } = renderHook(() => useDataSearch());

      const filteredData = result.current.filterData(mockUsers);
      expect(filteredData).toEqual(mockUsers);
      expect(filteredData).toHaveLength(5);
    });

    it('filters data by name (case insensitive)', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'john' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(2);
        expect(filteredData.map((user) => user.name)).toEqual(['John Doe', 'Bob Johnson']);
      });
    });

    it('filters data by email', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'example.com' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(1);
        expect(filteredData[0].email).toBe('john.doe@example.com');
      });
    });

    it('filters data by department', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'engineering' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(2);
        expect(filteredData.every((user) => user.department === 'Engineering')).toBe(true);
      });
    });

    it('filters data by numeric values', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: '35' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(1);
        expect(filteredData[0].age).toBe(35);
      });
    });

    it('filters data by boolean values', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'false' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(2);
        expect(filteredData.every((user) => user.isActive === false)).toBe(true);
      });
    });

    it('handles case insensitive searches', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'ALICE BROWN' } as HTMLInputElement, // More specific to avoid partial matches
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(1);
        expect(filteredData[0].name).toBe('Alice Brown');
      });
    });

    // Add this test to verify single character case insensitive works correctly:
    it('handles single character case insensitive searches', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'j' } as HTMLInputElement, // Should match John and Jane and Bob Johnson
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(3); // John Doe, Jane Smith, Bob Johnson
        expect(filteredData.map((user) => user.name)).toEqual(
          expect.arrayContaining(['John Doe', 'Jane Smith', 'Bob Johnson']),
        );
      });
    });

    it('returns empty array when no matches found', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'nonexistent' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(0);
      });
    });
  });

  describe('Filter Exclusions', () => {
    // Replace the failing test in your original test file with this:

    it('excludes action field from search', async () => {
      const { result } = renderHook(() =>
        useDataSearch({
          enableFuzzySearch: false, // Explicitly disable fuzzy search
          searchFields: undefined, // Explicitly use default behavior
        }),
      );

      act(() => {
        result.current.handleSearch({
          target: { value: 'edit' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);

        // Debug info
        console.log('Search term:', result.current.searchTerm);
        console.log('Debounced term:', result.current.debouncedSearchTerm);
        console.log('Using fuzzy search:', result.current.isUsingFuzzySearch);
        console.log('Filtered results:', filteredData.length);
        console.log(
          'Results:',
          filteredData.map((u) => ({ name: u.name, action: u.action })),
        );

        // Should return empty because 'action' field is excluded from search
        expect(filteredData).toHaveLength(0);
      });
    });

    it('excludes null values from search', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'null' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        // Should not match the user with null department
        expect(filteredData).toHaveLength(0);
      });
    });

    it('excludes undefined values from search', () => {
      const dataWithUndefined = [
        { id: '1', name: 'Test', value: undefined },
        { id: '2', name: 'Another', value: 'test' },
      ];

      const { result } = renderHook(() => useDataSearch());

      const filteredData = result.current.filterData(dataWithUndefined);
      expect(filteredData).toEqual(dataWithUndefined);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      const { result } = renderHook(() => useDataSearch());

      const filteredData = result.current.filterData([]);
      expect(filteredData).toEqual([]);
    });

    it('handles data with missing properties', async () => {
      const incompleteData = [
        { id: '1', name: 'Test' },
        { id: '2' }, // Missing name
        { name: 'Another' }, // Missing id
      ];

      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: 'test' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(incompleteData);
        expect(filteredData).toHaveLength(1);
        expect(filteredData[0].name).toBe('Test');
      });
    });

    it('handles special characters in search', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: '@' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        // Should find all users with @ in their email
        expect(filteredData).toHaveLength(5);
      });
    });

    it('handles whitespace in search terms', async () => {
      const { result } = renderHook(() => useDataSearch());

      act(() => {
        result.current.handleSearch({
          target: { value: '  john  ' } as HTMLInputElement,
          type: 'change',
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const filteredData = result.current.filterData(mockUsers);
        expect(filteredData).toHaveLength(2);
      });
    });
  });

  describe('Function Stability', () => {
    it('maintains stable function references', () => {
      const { result, rerender } = renderHook(() => useDataSearch());

      const initialFunctions = {
        filterData: result.current.filterData,
        handleSearch: result.current.handleSearch,
        handleClear: result.current.handleClear,
      };

      // Trigger a state change
      act(() => {
        result.current.handleSearch({
          target: { value: 'test' } as HTMLInputElement,
          type: 'change',
        });
      });

      rerender();

      // Functions should maintain referential equality except filterData which depends on debouncedSearchTerm
      expect(result.current.handleSearch).toBe(initialFunctions.handleSearch);
      expect(result.current.handleClear).toBe(initialFunctions.handleClear);
      // filterData may change due to debouncedSearchTerm dependency, but should be stable when debounced term is same
    });

    it('filterData function reference changes only when debouncedSearchTerm changes', async () => {
      const { result } = renderHook(() => useDataSearch());

      const initialFilterData = result.current.filterData;

      // Change search term but don't advance timers
      act(() => {
        result.current.handleSearch({
          target: { value: 'test' } as HTMLInputElement,
          type: 'change',
        });
      });

      // filterData should still be the same since debouncedSearchTerm hasn't changed
      expect(result.current.filterData).toBe(initialFilterData);

      // Advance timers to trigger debounce
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        // Now filterData should be different since debouncedSearchTerm changed
        expect(result.current.filterData).not.toBe(initialFilterData);
      });
    });
  });

  describe('TypeScript Generics', () => {
    it('works with different data types', () => {
      interface Product {
        id: string;
        title: string;
        price: number;
        category: string;
      }

      const products: Product[] = [
        { id: '1', title: 'Laptop', price: 999, category: 'Electronics' },
        { id: '2', title: 'Book', price: 25, category: 'Education' },
      ];

      const { result } = renderHook(() => useDataSearch());

      const filteredProducts = result.current.filterData(products);
      expect(filteredProducts).toEqual(products);
      expect(filteredProducts).toHaveLength(2);
    });
  });

  describe('Enhanced useDataSearch Hook - New Functionality', () => {
    describe('Options Configuration', () => {
      it('accepts and applies configuration options', () => {
        const options = {
          enableFuzzySearch: true,
          fuzzyThreshold: 40,
          maxSuggestions: 3,
          searchFields: ['name', 'email'],
          minQueryLengthForFuzzy: 3,
          debounceDelay: 500,
        };

        const { result } = renderHook(() => useDataSearch(options));

        expect(result.current).toHaveProperty('showSuggestions');
        expect(result.current).toHaveProperty('getSuggestions');
        expect(result.current).toHaveProperty('handleSuggestionSelect');
        expect(result.current).toHaveProperty('hasResults');
        expect(result.current).toHaveProperty('isUsingFuzzySearch');
      });

      it('uses default values when no options provided', () => {
        const { result } = renderHook(() => useDataSearch());

        expect(typeof result.current.getSuggestions).toBe('function');
        expect(typeof result.current.handleSuggestionSelect).toBe('function');
        expect(typeof result.current.hasResults).toBe('function');
        expect(result.current.showSuggestions).toBe(false);
      });

      it('respects custom debounce delay', async () => {
        const { result } = renderHook(() => useDataSearch({ debounceDelay: 500 }));

        act(() => {
          result.current.handleSearch({
            target: { value: 'test' } as HTMLInputElement,
            type: 'change',
          });
        });

        // Should not be debounced after 300ms
        act(() => {
          jest.advanceTimersByTime(300);
        });
        expect(result.current.debouncedSearchTerm).toBe('');

        // Should be debounced after 500ms
        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(result.current.debouncedSearchTerm).toBe('test');
        });
      });
    });

    describe('Fuzzy Search Functionality', () => {
      it('falls back to exact search for short queries', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 3,
          }),
        );

        // Short query should use exact matching
        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(result.current.isUsingFuzzySearch).toBe(false);
          const filteredData = result.current.filterData(mockUsers);
          expect(filteredData).toHaveLength(2); // Exact matches for "jo"
        });
      });

      it('uses fuzzy search for longer queries', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 2,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'johnn' } as HTMLInputElement, // Typo in "john"
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(result.current.isUsingFuzzySearch).toBe(true);
          const filteredData = result.current.filterData(mockUsers);
          expect(filteredData.length).toBeGreaterThan(0); // Should find fuzzy matches
        });
      });

      it('can be disabled completely', async () => {
        const { result } = renderHook(() => useDataSearch({ enableFuzzySearch: false }));

        act(() => {
          result.current.handleSearch({
            target: { value: 'johnn' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(result.current.isUsingFuzzySearch).toBe(false);
          const filteredData = result.current.filterData(mockUsers);
          expect(filteredData).toHaveLength(0); // No exact matches for typo
        });
      });

      it('respects fuzzy threshold setting', async () => {
        const strictOptions = {
          enableFuzzySearch: true,
          fuzzyThreshold: 80,
          minQueryLengthForFuzzy: 2,
        };
        const lenientOptions = {
          enableFuzzySearch: true,
          fuzzyThreshold: 20,
          minQueryLengthForFuzzy: 2,
        };

        const { result: strictResult } = renderHook(() => useDataSearch(strictOptions));
        const { result: lenientResult } = renderHook(() => useDataSearch(lenientOptions));

        const searchValue = 'jhn'; // Missing vowels

        // Strict threshold
        act(() => {
          strictResult.current.handleSearch({
            target: { value: searchValue } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        // Lenient threshold
        act(() => {
          lenientResult.current.handleSearch({
            target: { value: searchValue } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const strictResults = strictResult.current.filterData(mockUsers);
          const lenientResults = lenientResult.current.filterData(mockUsers);

          expect(lenientResults.length).toBeGreaterThanOrEqual(strictResults.length);
        });
      });
    });

    describe('Field-Specific Search', () => {
      it('searches only specified fields when provided', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            searchFields: ['name'],
            enableFuzzySearch: false, // Use exact search for predictable results
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'example.com' } as HTMLInputElement, // This is in email, not name
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredData = result.current.filterData(mockUsers);
          expect(filteredData).toHaveLength(0); // Should not find email matches when only searching names
        });
      });

      it('searches multiple specified fields', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            searchFields: ['name', 'department'],
            enableFuzzySearch: false,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'Engineering' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredData = result.current.filterData(mockUsers);
          expect(filteredData).toHaveLength(2); // Should find department matches
          expect(filteredData.every((user) => user.department === 'Engineering')).toBe(true);
        });
      });

      it('handles nested field paths', async () => {
        const nestedData = [
          { id: '1', user: { profile: { name: 'John Doe' } }, active: true },
          { id: '2', user: { profile: { name: 'Jane Smith' } }, active: false },
        ];

        const { result } = renderHook(() =>
          useDataSearch({
            searchFields: ['user.profile.name'],
            enableFuzzySearch: false,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'John' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredData = result.current.filterData(nestedData);
          expect(filteredData).toHaveLength(1);
          expect(filteredData[0].user.profile.name).toBe('John Doe');
        });

        // Test that it doesn't find matches in other fields
        act(() => {
          result.current.handleSearch({
            target: { value: 'true' } as HTMLInputElement, // This is in 'active' field
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredDataBoolean = result.current.filterData(nestedData);
          expect(filteredDataBoolean).toHaveLength(0); // Should not find 'active' field when only searching name
        });
      });
    });

    describe('Suggestions Functionality', () => {
      it('generates suggestions from data', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            maxSuggestions: 3,
            minQueryLengthForFuzzy: 2,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        const suggestions = result.current.getSuggestions(mockUsers);
        expect(Array.isArray(suggestions)).toBe(true);
        expect(suggestions.length).toBeLessThanOrEqual(3);
      });

      it('limits suggestions to maxSuggestions setting', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            maxSuggestions: 2,
            minQueryLengthForFuzzy: 1,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'e' } as HTMLInputElement, // Common letter
            type: 'change',
          });
        });

        const suggestions = result.current.getSuggestions(mockUsers);
        expect(suggestions.length).toBeLessThanOrEqual(2);
      });

      it('returns empty suggestions for short queries', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 3,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        const suggestions = result.current.getSuggestions(mockUsers);
        expect(suggestions).toHaveLength(0);
      });

      it('does not include exact matches in suggestions', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 2,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'John' } as HTMLInputElement, // Exact match
            type: 'change',
          });
        });

        const suggestions = result.current.getSuggestions(mockUsers);
        expect(suggestions).not.toContain('John');
      });
    });

    describe('Suggestion Interaction', () => {
      it('updates search term when suggestion is selected', () => {
        const { result } = renderHook(() => useDataSearch());

        act(() => {
          result.current.handleSuggestionSelect('Engineering');
        });

        expect(result.current.searchTerm).toBe('Engineering');
        expect(result.current.showSuggestions).toBe(false);
      });

      it('shows suggestions when search term meets minimum length', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 2,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        expect(result.current.showSuggestions).toBe(true);
      });

      it('hides suggestions when search term is too short', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 3,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        expect(result.current.showSuggestions).toBe(false);
      });

      it('can manually control suggestion visibility', () => {
        const { result } = renderHook(() => useDataSearch());

        act(() => {
          result.current.setShowSuggestions(true);
        });

        expect(result.current.showSuggestions).toBe(true);

        act(() => {
          result.current.setShowSuggestions(false);
        });

        expect(result.current.showSuggestions).toBe(false);
      });
    });

    describe('hasResults Function', () => {
      it('returns true when filtered data has results', async () => {
        const { result } = renderHook(() => useDataSearch());

        act(() => {
          result.current.handleSearch({
            target: { value: 'John' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(result.current.hasResults(mockUsers)).toBe(true);
        });
      });

      it('returns false when filtered data has no results', async () => {
        const { result } = renderHook(() => useDataSearch());

        act(() => {
          result.current.handleSearch({
            target: { value: 'nonexistent' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(result.current.hasResults(mockUsers)).toBe(false);
        });
      });

      it('returns true for empty search term', () => {
        const { result } = renderHook(() => useDataSearch());

        expect(result.current.hasResults(mockUsers)).toBe(true);
      });
    });

    describe('Enhanced handleSearch', () => {
      it('updates showSuggestions based on search term length', () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 3,
          }),
        );

        // Short term - should not show suggestions
        act(() => {
          result.current.handleSearch({
            target: { value: 'jo' } as HTMLInputElement,
            type: 'change',
          });
        });

        expect(result.current.showSuggestions).toBe(false);

        // Long enough term - should show suggestions
        act(() => {
          result.current.handleSearch({
            target: { value: 'john' } as HTMLInputElement,
            type: 'change',
          });
        });

        expect(result.current.showSuggestions).toBe(true);
      });

      it('maintains backward compatibility with original event signature', () => {
        const { result } = renderHook(() => useDataSearch());

        const mockEvent = {
          target: { value: 'test' } as HTMLInputElement,
          type: 'change' as const,
        };

        expect(() => {
          act(() => {
            result.current.handleSearch(mockEvent);
          });
        }).not.toThrow();

        expect(result.current.searchTerm).toBe('test');
      });
    });

    describe('Enhanced handleClear', () => {
      it('clears suggestions when clearing search', () => {
        const { result } = renderHook(() => useDataSearch());

        // First set search and suggestions
        act(() => {
          result.current.handleSearch({
            target: { value: 'test' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          result.current.setShowSuggestions(true);
        });

        expect(result.current.showSuggestions).toBe(true);

        // Clear should hide suggestions
        act(() => {
          result.current.handleClear();
        });

        expect(result.current.searchTerm).toBe('');
        expect(result.current.showSuggestions).toBe(false);
      });
    });

    describe('Fuzzy Score Algorithm', () => {
      it('prioritizes exact matches', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            minQueryLengthForFuzzy: 2,
          }),
        );

        const testData = [
          { id: '1', name: 'john' },
          { id: '2', name: 'johnson' },
          { id: '3', name: 'johnny' },
        ];

        act(() => {
          result.current.handleSearch({
            target: { value: 'john' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredData = result.current.filterData(testData);
          expect(filteredData[0].name).toBe('john'); // Exact match should be first
        });
      });

      it('handles partial character matches', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            fuzzyThreshold: 30,
            minQueryLengthForFuzzy: 2,
          }),
        );

        const testData = [
          { id: '1', name: 'programming' },
          { id: '2', name: 'marketing' },
        ];

        act(() => {
          result.current.handleSearch({
            target: { value: 'prgm' } as HTMLInputElement, // Missing vowels
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          const filteredData = result.current.filterData(testData);
          expect(filteredData.length).toBeGreaterThan(0);
          expect(filteredData.some((item) => item.name === 'programming')).toBe(true);
        });
      });
    });

    describe('Error Handling', () => {
      it('handles malformed data gracefully', () => {
        const malformedData = [null, undefined, { id: '1', name: 'Valid' }, 'not an object', { circular: {} }];

        // Add circular reference
        (malformedData[4] as any).circular.ref = malformedData[4];

        const { result } = renderHook(() => useDataSearch());

        expect(() => {
          result.current.filterData(malformedData as any);
        }).not.toThrow();
      });

      it('handles empty suggestions gracefully', () => {
        const { result } = renderHook(() => useDataSearch());

        expect(() => {
          result.current.getSuggestions([]);
        }).not.toThrow();

        expect(result.current.getSuggestions([])).toEqual([]);
      });

      it('handles invalid search fields gracefully', async () => {
        const { result } = renderHook(() =>
          useDataSearch({
            searchFields: ['nonexistent.field.path'],
            enableFuzzySearch: false,
          }),
        );

        act(() => {
          result.current.handleSearch({
            target: { value: 'test' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(() => {
            result.current.filterData(mockUsers);
          }).not.toThrow();
        });
      });
    });

    describe('Performance', () => {
      it('maintains function stability for new functions', () => {
        const { result, rerender } = renderHook(() => useDataSearch());

        const initialFunctions = {
          getSuggestions: result.current.getSuggestions,
          handleSuggestionSelect: result.current.handleSuggestionSelect,
          hasResults: result.current.hasResults,
          setShowSuggestions: result.current.setShowSuggestions,
        };

        rerender();

        expect(result.current.getSuggestions).toBe(initialFunctions.getSuggestions);
        expect(result.current.handleSuggestionSelect).toBe(initialFunctions.handleSuggestionSelect);
        expect(result.current.hasResults).toBe(initialFunctions.hasResults);
        expect(result.current.setShowSuggestions).toBe(initialFunctions.setShowSuggestions);
      });

      it('handles large datasets efficiently', () => {
        const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
          id: `${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          department: i % 2 === 0 ? 'Engineering' : 'Marketing',
        }));

        const { result } = renderHook(() =>
          useDataSearch({
            enableFuzzySearch: true,
            fuzzyThreshold: 50,
          }),
        );

        const startTime = performance.now();

        act(() => {
          result.current.handleSearch({
            target: { value: 'user1' } as HTMLInputElement,
            type: 'change',
          });
        });

        act(() => {
          jest.advanceTimersByTime(300);
        });

        const filteredData = result.current.filterData(largeDataset);
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        expect(filteredData.length).toBeGreaterThan(0);
      });
    });
  });
});
