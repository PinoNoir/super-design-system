import { useEffect, useState, useCallback, useMemo } from 'react';

// Simple fuzzy search scoring function
function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;

  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();

  // Exact match gets highest score
  if (targetLower === queryLower) return 100;

  // Starts with query gets high score
  if (targetLower.startsWith(queryLower)) return 90;

  // Contains query gets medium score
  if (targetLower.includes(queryLower)) return 70;

  // Fuzzy character matching
  let queryIndex = 0;
  let targetIndex = 0;
  let matches = 0;

  while (queryIndex < queryLower.length && targetIndex < targetLower.length) {
    if (queryLower[queryIndex] === targetLower[targetIndex]) {
      matches++;
      queryIndex++;
    }
    targetIndex++;
  }

  // Calculate score based on character matches
  const matchRatio = matches / queryLower.length;
  return matchRatio > 0.6 ? Math.floor(matchRatio * 60) : 0;
}

export interface UseDataSearchOptions {
  /** Enable fuzzy search for better matching */
  enableFuzzySearch?: boolean;
  /** Minimum score threshold for fuzzy matching (0-100) */
  fuzzyThreshold?: number;
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Specific fields to search in (if not provided, searches all fields) */
  searchFields?: string[];
  /** Minimum query length before fuzzy search kicks in */
  minQueryLengthForFuzzy?: number;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
}

const useDataSearch = (options: UseDataSearchOptions = {}) => {
  const {
    enableFuzzySearch = true,
    fuzzyThreshold = 30,
    maxSuggestions = 5,
    searchFields,
    minQueryLengthForFuzzy = 2,
    debounceDelay = 300,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, debounceDelay]);

  // Get searchable text from an object
  const getSearchableText = useCallback(
    (item: any): string => {
      if (!item) return '';

      if (searchFields && searchFields.length > 0) {
        return searchFields
          .map((field) => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return String(value || '');
          })
          .filter((text) => text.length > 0)
          .join(' ');
      }

      // Default: search all fields except 'action' and null values
      return Object.entries(item)
        .filter(([key, value]) => key !== 'action' && value != null)
        .map(([, value]) => String(value))
        .join(' ');
    },
    [searchFields],
  );

  // Enhanced filter function with fuzzy search
  const filterData = useCallback(
    <T extends Record<string, any>>(data: T[]): T[] => {
      const trimmedSearchTerm = debouncedSearchTerm.trim();
      if (!trimmedSearchTerm) {
        return data;
      }

      // For very short queries or when fuzzy search is disabled, use exact matching
      if (!enableFuzzySearch || trimmedSearchTerm.length < minQueryLengthForFuzzy) {
        return data.filter((item: any) => {
          if (searchFields && searchFields.length > 0) {
            // Use field-specific search
            const searchableText = getSearchableText(item);
            return searchableText.toLowerCase().includes(trimmedSearchTerm.toLowerCase());
          } else {
            // ORIGINAL LOGIC: search all fields except 'action' and null values
            return Object.entries(item).some(([key, value]) => {
              if (key === 'action' || value == null) {
                return false;
              }
              return String(value).toLowerCase().includes(trimmedSearchTerm.toLowerCase());
            });
          }
        });
      }

      // Use fuzzy search for longer queries
      const scoredResults = data
        .map((item) => {
          const searchableText = getSearchableText(item);
          const score = fuzzyScore(trimmedSearchTerm, searchableText);
          return { item, score };
        })
        .filter((result) => result.score >= fuzzyThreshold)
        .sort((a, b) => b.score - a.score);

      return scoredResults.map((result) => result.item);
    },
    [debouncedSearchTerm, enableFuzzySearch, minQueryLengthForFuzzy, fuzzyThreshold, getSearchableText, searchFields],
  );

  // Generate search suggestions
  const getSuggestions = useCallback(
    <T extends Record<string, any>>(data: T[]): string[] => {
      if (!enableFuzzySearch || !searchTerm.trim() || searchTerm.length < minQueryLengthForFuzzy) {
        return [];
      }

      const query = searchTerm.trim();
      const suggestions = new Set<string>();

      // Get all unique searchable values
      data.forEach((item) => {
        const searchableText = getSearchableText(item);
        const words = searchableText.split(/\s+/).filter((word) => word.length > 1);

        words.forEach((word) => {
          const score = fuzzyScore(query, word);
          if (score >= fuzzyThreshold && score < 100 && !suggestions.has(word)) {
            suggestions.add(word);
          }
        });
      });

      return Array.from(suggestions)
        .slice(0, maxSuggestions)
        .sort((a, b) => fuzzyScore(query, b) - fuzzyScore(query, a));
    },
    [searchTerm, enableFuzzySearch, minQueryLengthForFuzzy, fuzzyThreshold, maxSuggestions, getSearchableText],
  );

  // Enhanced handlers
  const handleSearch = useCallback(
    (event: { target: HTMLInputElement; type: 'change' }) => {
      const value = event.target.value;
      setSearchTerm(value);
      setShowSuggestions(enableFuzzySearch && value.length >= minQueryLengthForFuzzy);
    },
    [enableFuzzySearch, minQueryLengthForFuzzy],
  );

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setShowSuggestions(false);
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  }, []);

  // Check if current search has results
  const hasResults = useCallback(
    <T extends Record<string, any>>(data: T[]): boolean => {
      return filterData(data).length > 0;
    },
    [filterData],
  );

  return {
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
    // Expose configuration for debugging
    isUsingFuzzySearch: enableFuzzySearch && debouncedSearchTerm.length >= minQueryLengthForFuzzy,
  };
};

export default useDataSearch;
