import React from 'react';
import clsx from 'clsx';
import styles from './styles/SuggestionList.module.css';

export type SuggestionListProps = {
  suggestions: string[];
  highlightedIndex: number | null;
  onSelect: (suggestion: string) => void;
  onHighlight: (index: number) => void;
  id?: string;
  className?: string;
};

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
  id = 'suggestion-listbox',
  className,
}) => {
  return (
    <div role="listbox" id={id} className={clsx(styles.suggestionList, className)}>
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion}
          id={`suggestion-${index}`}
          role="option"
          aria-selected={highlightedIndex === index}
          tabIndex={-1}
          className={clsx(styles.suggestionItem, {
            [styles.highlighted]: highlightedIndex === index,
          })}
          onMouseDown={() => onSelect(suggestion)}
          onMouseEnter={() => onHighlight(index)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
