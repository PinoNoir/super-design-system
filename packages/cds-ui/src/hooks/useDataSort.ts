import { useCallback, useState } from 'react';
import { SortOrder } from '../components/data-table/types/data-table-generics';

interface SortableData {
  [key: string]: any;
}

type ComparisonResult = -1 | 0 | 1;

// Helper function to validate and parse dates
const parseDateValue = (value: any): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return null;

  // Try parsing the string date
  const date = new Date(value);
  return !isNaN(date.getTime()) ? date : null;
};

// Helper function to check if a string is numeric
const isNumeric = (value: any): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

const useDataSort = (defaultSortKey: string = '') => {
  const [sortKey, setSortKey] = useState<string>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortOrder>('none');
  const [hasSorted, setHasSorted] = useState(false);

  const compareValues = useCallback((a: any, b: any, key: string): ComparisonResult => {
    if (a === b) return 0;

    const varA = a[key];
    const varB = b[key];

    // Null/undefined handling
    if (varA == null && varB == null) return 0;
    if (varA == null) return 1;
    if (varB == null) return -1;

    // Handle numeric strings and numbers
    if (isNumeric(varA) && isNumeric(varB)) {
      const numA = typeof varA === 'string' ? parseFloat(varA) : varA;
      const numB = typeof varB === 'string' ? parseFloat(varB) : varB;
      return Math.sign(numA - numB) as ComparisonResult;
    }

    // Date handling
    const dateA = parseDateValue(varA);
    const dateB = parseDateValue(varB);

    if (dateA && dateB) {
      return Math.sign(dateA.getTime() - dateB.getTime()) as ComparisonResult;
    }

    // String comparison
    if (typeof varA === 'string' && typeof varB === 'string') {
      return varA.trim().toLowerCase().localeCompare(varB.trim().toLowerCase()) as ComparisonResult;
    }

    // Number comparison with type checking
    if (typeof varA === 'number' && typeof varB === 'number') {
      return Math.sign(varA - varB) as ComparisonResult;
    }

    // Boolean comparison
    if (typeof varA === 'boolean' && typeof varB === 'boolean') {
      if (varA === varB) return 0;
      return (varA ? 1 : -1) as ComparisonResult;
    }

    // Fallback comparison with type safety
    let result: ComparisonResult;
    if (varA > varB) {
      result = 1;
    } else if (varA < varB) {
      result = -1;
    } else {
      result = 0;
    }
    return result;
  }, []);

  // Return a sort function instead of sorted data
  const sortedData = useCallback(
    <T extends SortableData>(data: T[]): T[] => {
      if (!hasSorted || !sortKey) {
        return data;
      }
      return [...data].sort((a, b) => {
        if (!Object.hasOwn(a, sortKey) || !Object.hasOwn(b, sortKey)) {
          return 0;
        }
        const comparison = compareValues(a, b, sortKey);
        return sortDirection === 'descending' ? -comparison : comparison;
      });
    },
    [sortKey, sortDirection, compareValues, hasSorted],
  );

  // Sort handler with error handling
  const handleSort = useCallback(
    (key: string) => {
      if (typeof key !== 'string' || !key) {
        return;
      }

      setHasSorted(true);

      if (key !== sortKey) {
        setSortKey(key);
        setSortDirection('ascending');
      } else {
        setSortDirection((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
      }
    },
    [sortKey],
  );

  return {
    sortedData,
    handleSort,
    setSortDirection,
    sortKey,
    sortDirection,
    hasSorted,
  };
};

export default useDataSort;
