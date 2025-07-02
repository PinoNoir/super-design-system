import { clsx } from 'clsx';
import React from 'react';
import styles from './styles/CurrencyInput.module.css';
import { formatStringAsCurrency, formatValueAsBigDecimal, numberInputProps, onlyNumbersAndDot } from './utils/util';
import { useNormalizedInputProps } from '../input-fields/utils/use-normalized-input-props';

type ExcludedAttributes = 'defaultValue' | 'id' | 'value' | 'onChange';

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAttributes> {
  /**
   * The id of the input element. Used for linking the label element to the `<input>` element.
   */
  id?: string;
  /**
   * Optionally add a custom CSS class to apply to the `<input>` element.
   */
  className?: string;
  /**
   * The label text for the `<input>`.
   */
  label?: string;
  /**
   * Hides the label visually but keeps it available for screen readers.
   */
  hideLabel?: boolean;
  /**
   * If true, the `<input>` will be displayed inline.
   */
  inline?: boolean;
  /**
   * If true, the `<input>` will be disabled.
   */
  disabled?: boolean;
  /**
   * Helper text to display below the `<input>`.
   */
  helperText?: string;
  /**
   * If true, the `<input>` will be marked as invalid.
   */
  invalid?: boolean;
  /**
   * Text to display when the `<input>` is marked as invalid.
   */
  invalidText?: string;
  /**
   * If true, the `<input>` will be marked as a warning.
   */
  warn?: boolean;
  /**
   * Text to display when the `<input>` is marked as a warning.
   */
  warnText?: string;
  /**
   * If true, the `<input>` will be marked as a success.
   */
  success?: boolean;
  /**
   * Text to display when the `<input>` is marked as a success.
   */
  successText?: string;
  /**
   * Callback function that is called when the `<input>` value changes. The value is a number or null.
   */
  onChange?: (value: number | null) => void;
  /**
   * Callback function that is called when the `<input>` value changes. The value is a string.
   */
  onChangeString?: (value: string) => void;
  /**
   * Callback function that is called when the `<input>` is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /**
   * The placeholder text for the `<input>`.
   */
  placeholder?: string;
  /**
   * If true, the `<input>` will be required.
   */
  required?: boolean;
  /**
   * If true, the `<input>` will be read-only.
   */
  readOnly?: boolean;
  /**
   * Optionally set the initial value of the `<input>`.
   */
  initValue?: number;
  /**
   * If true, the `<input>` will be set to 0 if the value is empty.
   */
  setZeroIfEmpty?: boolean;
  /**
   * If true, the `<input>` will show a dollar sign.
   */
  showDollarSign?: boolean;
  /**
   * If true, the `<input>` will allow the user to type 'NA'.
   */
  allowNa?: boolean;
  /**
   * If true, the `<input>` will allow the user to type 'N/A' in slash format.
   */
  acceptNaWithSlashFormat?: boolean;

  /**
   * If true, the `<input>` will display the value as a percentage.
   */
  isPercentage?: boolean;

  /**
   * The automation id used for testing purposes.
   */
  ['automation-id']?: string;
}

/**
 * Currency inputs allow users to enter decimal and numerical values and are
 * specifically used in scenarios where these values are necessary for users to carry out their tasks.
 */
const CurrencyInput = ({
  id,
  className,
  label,
  hideLabel = false,
  inline = false,
  disabled = false,
  placeholder = '',
  required,
  readOnly,
  helperText,
  invalid = false,
  invalidText,
  warn = false,
  warnText,
  success = false,
  successText,
  onChange,
  onChangeString,
  onClick = () => {},
  initValue,
  setZeroIfEmpty = false,
  showDollarSign = true,
  allowNa = false,
  acceptNaWithSlashFormat = false,
  isPercentage = false,
}: CurrencyInputProps) => {
  // Initialize value
  let strInit = '';
  if (initValue === undefined) {
    if (setZeroIfEmpty) {
      strInit = '0';
    }
  } else {
    strInit = initValue.toString();
  }

  // Determine if the dollar sign should be shown
  const effectiveShowDollarSign = isPercentage ? false : showDollarSign;

  // Update the initial state logic
  const [inputValue, setInputValue] = React.useState('');

  // Instead of complex initialization, let's use an effect to set initial value only when needed
  React.useEffect(() => {
    // Only format and set initial value if we have a non-empty initial value
    if (strInit && strInit !== '') {
      const formattedValue = formatStringAsCurrency(strInit, effectiveShowDollarSign, setZeroIfEmpty);
      setInputValue(isPercentage ? `${formattedValue.replace(/[$%]/g, '')}%` : formattedValue);
    }
    return () => {
      // Cleanup function to reset the input value if needed
      setInputValue('');
    };
  }, [effectiveShowDollarSign, isPercentage, setZeroIfEmpty, strInit]);

  // Refs for DOM and cursor position
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cursorPositionRef = React.useRef<number>(0);

  const normalizedProps = useNormalizedInputProps({
    id,
    readOnly,
    disabled,
    invalid,
    invalidText,
    warn,
    warnText,
    success,
    successText,
    required,
  });

  const isNaAttemptOrEmpty = (value: string) => {
    return (
      value === '' || (allowNa && /^n[a]?$/i.test(value)) || (acceptNaWithSlashFormat && /^n\/?[a]?$/i.test(value))
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const newValue = input.value;
    const cursorPosition = input.selectionStart || 0;

    // Check if this is an N/A attempt, with very permissive matching
    // This needs to catch any stage of typing N, N/, NA, N/A
    const isNaAttempt =
      (allowNa && /^n[a]?$/i.test(newValue)) || (acceptNaWithSlashFormat && /^n\/?[a]?$/i.test(newValue));

    if (isNaAttempt) {
      // For N/A attempts, just set the value directly without any formatting
      setInputValue(newValue);
      return;
    }

    // For regular inputs, apply number validation
    // Remove percentage sign before validation
    const valueForValidation = inputValue.replace(/%/g, '');
    const validatedValue = onlyNumbersAndDot(valueForValidation, newValue, allowNa, acceptNaWithSlashFormat);

    // Only add percentage sign for non-empty values that aren't N/A attempts
    const finalValue =
      isPercentage && validatedValue !== '' && !isNaAttempt ? `${validatedValue.replace(/%/g, '')}%` : validatedValue;

    // Set cursor position
    const newCursorPosition = Math.min(cursorPosition, finalValue.length);
    cursorPositionRef.current = newCursorPosition;

    // Update state
    setInputValue(finalValue);
  };

  const handleOnBlur = () => {
    // Check if the current value is some form of N/A
    const naRegex = /^na$/i;
    const naWithSlashRegex = /^n\/a$/i;

    const isNaValue =
      (allowNa && naRegex.test(inputValue)) || (acceptNaWithSlashFormat && naWithSlashRegex.test(inputValue));

    if (isNaValue) {
      // Normalize N/A to uppercase
      const normalizedNA = acceptNaWithSlashFormat ? 'N/A' : 'NA';

      if (onChangeString) {
        onChangeString(normalizedNA);
      }

      if (onChange) {
        onChange(null);
      }

      // Set the normalized N/A value
      setInputValue(normalizedNA);
      return;
    }

    // Handle normal number values
    const cleanValue = inputValue.replace(/%/g, '');
    const stringValue = formatStringAsCurrency(cleanValue, effectiveShowDollarSign, setZeroIfEmpty);

    if (onChangeString) {
      onChangeString(stringValue);
    }

    const numberValue = formatValueAsBigDecimal(stringValue);
    if (onChange) {
      onChange(numberValue);
    }

    // Format with percentage sign if needed
    const finalValue = isPercentage ? `${stringValue.replace(/[$%]/g, '')}%` : stringValue;
    setInputValue(finalValue);
  };

  const numberInputClasses = clsx(styles.numberInput, className, {
    [styles.numberInputInvalid]: invalid,
  });

  let inputPattern: string;

  if (isNaAttemptOrEmpty(inputValue)) {
    inputPattern = '.*'; // Very permissive pattern for empty or N/A inputs
  } else if (isPercentage) {
    inputPattern = '^\\d+(\\.\\d+)?%?$'; // Percentage pattern
  } else {
    inputPattern = '^\\d+(\\.\\d{2})?$'; // Default currency pattern
  }

  const sharedNumberInputProps = {
    id,
    placeholder,
    className: numberInputClasses,
    title: placeholder,
    ref: inputRef,
    value: inputValue,
    disabled: normalizedProps.disabled,
    required: normalizedProps.required,
    readOnly,
    pattern: inputPattern,
    onChange: handleInputChange,
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!normalizedProps.disabled) {
        onClick(event);
      }
    },
    onBlur: handleOnBlur,
  };

  const inputWrapperClasses = clsx(className, styles.formItem, styles.numberInputWrapper, {
    [styles.numberInputWrapperInline]: inline,
    [styles.numberInputWrapperInlineInvalid]: inline && normalizedProps.invalid,
  });

  const labelClasses = clsx(styles.label, {
    [styles.labelDisabled]: disabled,
    [styles.visuallyHidden]: hideLabel,
    [styles.labelInline]: inline,
    [styles.requiredLabel]: required,
  });

  const helperTextClasses = clsx(styles.formHelperText, {
    [styles.formHelperTextDisabled]: disabled,
    [styles.formHelperTextInline]: inline,
  });

  const fieldOuterWrapperClasses = clsx(styles.numberInputFieldOuterWrapper, {
    [styles.numberInputFieldOuterWrapperInline]: inline,
  });

  const fieldWrapperClasses = clsx(styles.numberInputFieldWrapper, {
    [styles.numberInputFieldWrapperWarning]: normalizedProps.warn,
    [styles.numberInputFieldWrapperInvalid]: normalizedProps.invalid,
    [styles.numberInputFieldWrapperSuccess]: normalizedProps.success,
  });

  const labelElement = label ? (
    <label htmlFor={id} className={labelClasses} data-required={normalizedProps.required ? 'true' : 'false'}>
      {label}
    </label>
  ) : null;

  const labelWrapper = <div className={styles.numberInputLabelWrapper}>{labelElement}</div>;

  const helper = helperText ? (
    <div id={normalizedProps.helperId} className={helperTextClasses}>
      {helperText}
    </div>
  ) : null;

  const input = (
    <input
      {...numberInputProps({
        sharedNumberInputProps,
        invalid: normalizedProps.invalid,
        invalidId: normalizedProps.invalidId,
        value: inputValue,
      })}
    />
  );

  const icon = normalizedProps.icon as React.ReactElement | null;

  return (
    <div className={inputWrapperClasses}>
      {!inline ? (
        labelWrapper
      ) : (
        <div className={`${styles.numberInputLabelHelperWrapper}`}>
          {labelWrapper}
          {normalizedProps.validation ?? helper}
        </div>
      )}
      <div className={fieldOuterWrapperClasses}>
        <div className={fieldWrapperClasses} data-invalid={normalizedProps.invalid ?? null}>
          {icon}
          {input}
          {inline && normalizedProps.validation}
        </div>
        {!inline && <>{normalizedProps.validation ?? helper}</>}
      </div>
    </div>
  );
};

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
