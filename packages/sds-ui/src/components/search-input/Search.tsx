import React, { HTMLAttributes, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { composeEventHandlers } from '../../utilities/events';
import { focus } from '../../utilities/focus';
import { keys, match } from '../../utilities/keyboard';
import { useId } from '../../utilities/use-id';
import { mergeRefs } from './../../utilities/use-merged-refs';
import styles from './styles/Search.module.css';
import { clsx } from 'clsx';
import { CloseIcon, SearchIcon } from '../icon';

type InputPropsBase = Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>;

export interface SearchProps extends InputPropsBase {
  /**
   * Specify an optional value for the `autocomplete` property on the underlying `<input>`, defaults to "off"
   */
  autoComplete?: string;

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string;

  /**
   * Specify a label to be read by screen readers on the "close" button
   */
  closeButtonLabelText?: string;

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue?: string | number;

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled?: boolean;

  /**
   * Specify whether or not ExpandableSearch should render expanded or not
   */
  isExpanded?: boolean;

  /**
   * Specify a custom `id` for the input
   */
  id?: string;

  /**
   * Provide the label text for the Search icon
   */
  label?: React.ReactNode;

  /**
   * Specify if the label should be hidden visually but still accessible to screen readers
   */
  hideLabel?: boolean;

  /**
   * Optional callback called when the search value changes.
   */
  onChange?(event: { target: HTMLInputElement; type: 'change' }): void;

  /**
   * Optional callback called when the search value is cleared.
   */
  onClear?(): void;

  /**
   * Optional callback called when the magnifier icon is clicked in ExpandableSearch
   */
  onExpand?(event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>): void;

  /**
   * Provide an optional placeholder text for the Search. Note: if the label and placeholder differ, VoiceOver on Mac will read both
   */
  placeholder?: string;

  /**
   * Specify the role for the underlying `<input>`, defaults to `searchbox`
   */
  role?: string;

  /**
   * Optional prop to specify the type of the `<input>`
   */
  type?: string;

  /**
   * Specify the value of the `<input>`
   */
  value?: string | number;
  /**
   *
   */
  ariaControls?: string;
  /**
   *
   */
  ariaActiveDescendant?: string;
  /**
   *
   */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    autoComplete = 'off',
    className,
    closeButtonLabelText = 'Clear search input',
    defaultValue,
    disabled,
    isExpanded = true,
    onExpand,
    id,
    label,
    hideLabel = true,
    onChange = () => {},
    onClear = () => {},
    placeholder = 'Search',
    role = 'searchbox',
    type = 'text',
    value,
    ariaControls,
    ariaActiveDescendant,
    onKeyDown,
    ...props
  },
  forwardRef,
) {
  const hasPropValue = !!(value || defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = mergeRefs<HTMLInputElement>(forwardRef, inputRef);
  const expandButtonRef = useRef<HTMLDivElement>(null);
  const inputId = useId('search-input');
  const uniqueId = id || inputId;
  const [hasContent, setHasContent] = useState(hasPropValue || false);
  const [prevValue, setPrevValue] = useState(value);

  const searchClasses = clsx(
    styles.search,
    {
      [styles.searchDisabled]: disabled,
      [styles.searchCollapsed]: onExpand && !isExpanded,
      [styles.searchExpanded]: !onExpand || isExpanded,
    },
    className,
  );

  const clearClasses = clsx({
    [styles.searchClose]: true,
    [styles.searchCloseHidden]: !hasContent || !isExpanded,
  });

  const labelClasses = clsx(styles.label, {
    [styles.visuallyHidden]: hideLabel,
  });

  if (value !== prevValue) {
    setHasContent(!!value);
    setPrevValue(value);
  }

  function clearInput() {
    if (!value && inputRef.current) {
      inputRef.current.value = '';
    }

    const inputTarget = { ...inputRef.current, value: '' };
    const clearedEvt = { target: inputTarget, type: 'change' } as const;

    onChange(clearedEvt);
    onClear();
    setHasContent(false);
    focus(inputRef);
  }

  function handleChange(event: { target: HTMLInputElement; type: 'change' }) {
    setHasContent(event.target.value !== '');
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (match(event, keys.Escape)) {
      event.stopPropagation();
      if (inputRef.current?.value) {
        clearInput();
      }
      // ExpandableSearch closes on escape when isExpanded, focus search activation button
      else if (onExpand && isExpanded) {
        expandButtonRef.current?.focus();
      }
    }
  }

  function handleExpandButtonKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (match(event, keys.Enter) || match(event, keys.Space)) {
      event.preventDefault();
      event.stopPropagation();
      if (onExpand) {
        onExpand(event);
      }
    }
  }

  const labelElement = label ? (
    <label htmlFor={id} className={labelClasses}>
      {label}
    </label>
  ) : null;

  return (
    <div className={styles.searchOuterWrapper}>
      {labelElement}
      <div role="search" aria-label={placeholder} className={searchClasses}>
        <div
          className={styles.searchIcon}
          aria-labelledby={onExpand ? uniqueId : undefined}
          role={onExpand ? 'button' : undefined}
          onClick={onExpand}
          onKeyDown={handleExpandButtonKeyDown}
          tabIndex={onExpand && !isExpanded ? 0 : -1}
          ref={expandButtonRef}
          aria-expanded={onExpand ? isExpanded : undefined}
          aria-controls={onExpand ? uniqueId : undefined}
          automation-id="search-button"
        >
          <SearchIcon />
        </div>
        <input
          autoComplete={autoComplete}
          className={clsx(styles.searchInput, className)}
          defaultValue={defaultValue}
          disabled={disabled}
          role={role}
          ref={ref}
          id={uniqueId}
          onChange={(event) => {
            handleChange(event as { target: HTMLInputElement; type: 'change' });
            onChange(event as { target: HTMLInputElement; type: 'change' });
          }}
          onKeyDown={composeEventHandlers([handleKeyDown, onKeyDown])}
          placeholder={placeholder}
          type={type}
          value={value}
          tabIndex={onExpand && !isExpanded ? -1 : undefined}
          automation-id="search-input"
          aria-autocomplete="list"
          aria-controls={ariaControls}
          aria-activedescendant={ariaActiveDescendant}
        />

        <button
          automation-id="search-clear-button"
          aria-label={closeButtonLabelText}
          className={clearClasses}
          disabled={disabled}
          onClick={clearInput}
          title={closeButtonLabelText}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
});

Search.displayName = 'Search';

export default Search;
