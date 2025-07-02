import React, { ComponentPropsWithoutRef, ForwardedRef, useEffect, useRef, useState, KeyboardEvent } from 'react';
import noop from 'lodash/noop';
import mergeRefs from '../../utilities/merge-refs';

import styles from './styles/Checkbox.module.css';
import { clsx } from 'clsx';
import { useId } from '../../utilities/use-id';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> {
  /**
   * A11y prop to describe the content for screen readers
   */
  ariaLabel?: string;

  /**
   * A11y prop - An Id of an element which describes this option
   */
  ariaLabelledBy?: string;

  /**
   * The label text for the checkbox.
   */
  label: React.ReactNode | Array<React.ReactNode>;

  /**
   * Optionally hide the label text.
   */
  hideLabel?: boolean;

  /**
   * Use this when you want to control the component, this will set the state of the component
   */
  checked?: boolean;

  /**
   * Function called when the checkbox state changes.
   * Receives the current checked state as a boolean value.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /** An in between state to display a non selected */
  indeterminate?: boolean;

  /** the default value which the checkbox will start from  */
  defaultChecked?: boolean;

  /**
   * If true, the checkbox will be disabled.
   */
  disabled?: boolean;

  /**
   * If true, the checkbox will be required.
   */
  required?: boolean;

  /**
   * Specify a name for the checkbox.
   */
  name?: string;

  /**
   * The input control's value.
   */
  value?: string | number;

  /** Specifies the tab order of the input element */
  tabIndex?: number;

  /**
   * Optionally specify an automation ID for testing purposes.
   */
  'automation-id'?: string;
}

/**
 * Allows users to select one or more options from a number of choices
 */
const Checkbox = React.forwardRef(
  (
    {
      label,
      hideLabel = false,
      onChange = noop,
      checked,
      indeterminate = false,
      disabled = false,
      defaultChecked,
      required = false,
      ariaLabel,
      ariaLabelledBy,
      tabIndex,
      value = '',
      name = '',
      id,
      className,
      ...props
    }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    // Generate a unique ID if one is not provided
    const generatedId = useId('checkbox');
    const checkboxId = id || generatedId;

    // Refs for DOM elements
    const inputRef = useRef<HTMLInputElement>(null);

    // State management
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const finalChecked = isControlled ? checked : internalChecked;

    // Handle indeterminate state
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Handle change event
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;

      // Update internal state for uncontrolled component
      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      // Call the onChange handler with the event
      onChange(event);
    };

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !disabled) {
        event.preventDefault();

        // Simulate click for any listeners
        if (inputRef.current) {
          inputRef.current.click();
        }
      }
    };

    // Determine the appropriate aria label
    const finalAriaLabel = ariaLabel || (typeof label === 'string' ? label : undefined);

    // Generate class names
    const wrapperClasses = clsx(styles.checkboxWrapper, className);

    const indeterminateClasses = indeterminate ? styles.indeterminate : '';

    const checkboxClasses = clsx(styles.checkbox, indeterminateClasses, {
      [styles.disabled]: disabled,
    });

    const labelClasses = clsx(styles.label, {
      [styles.visuallyHidden]: hideLabel,
      [styles.requiredLabel]: required,
    });

    return (
      <div className={wrapperClasses} data-checked={finalChecked} data-indeterminate={indeterminate}>
        <input
          ref={mergeRefs(ref, inputRef)}
          id={checkboxId}
          type="checkbox"
          className={checkboxClasses}
          checked={isControlled ? finalChecked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          aria-label={finalAriaLabel}
          aria-labelledby={ariaLabelledBy}
          value={value}
          name={name}
          automation-id="checkbox"
          tabIndex={tabIndex}
          {...props}
        />

        {label && (
          <label
            htmlFor={checkboxId}
            className={labelClasses}
            data-required={required ? 'true' : 'false'}
            automation-id="checkbox-label"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
