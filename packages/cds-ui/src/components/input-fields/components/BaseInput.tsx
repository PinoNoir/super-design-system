import { clsx } from 'clsx';
import React from 'react';
import { useAnnouncer } from '../../../utilities/use-announcer';
import { useNormalizedInputProps } from '../utils/use-normalized-input-props';
import styles from '../styles/BaseInput.module.css';
import { ValidationMessage } from '../../validation-message';
import { HelperText } from '../../helper-text';
import { useId } from '../../../utilities/use-id';
import { FormatType, INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';
import { textInputProps } from '../utils/normalized-props';
import { FieldError, FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { FORMAT_CONFIGS } from '../utils/format-utils';

type ExcludedAttributes = 'defaultValue' | 'id' | 'value';

export interface BaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAttributes> {
  /**
   * Specify an optional className to be applied to the `<input>` node
   */
  className?: string;

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue?: string | number;

  name?: string;

  register?: UseFormRegister<any>;

  rules?: RegisterOptions;

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled?: boolean;

  /**
   * Specify whether to display the character counter
   */
  enableCounter?: boolean;

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText?: React.ReactNode;

  /**
   * Specify a custom `id` for the `<input>`
   */
  id: string;

  /**
   * `true` to use the inline version
   */
  inline?: boolean;

  /**
   * Specify whether the control is currently invalid
   */
  invalid?: boolean;

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText?: React.ReactNode | FieldError | FieldErrors;

  /**
   * Provide the text that will be read by a screen reader when visiting this
   */
  label: string;

  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel?: boolean;

  /**
   * Provide an accessible name for the input when the label is visually hidden
   */
  ariaLabel?: string;

  /**
   * Max character count allowed for the input. This is needed in order for enableCounter to display
   */
  maxCount?: number;

  /**
   * Optionally provide an `onChange` handler that is called whenever `<input>` is updated
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Optionally provide an `onClick` handler that is called whenever the `<input>` is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder?: string;

  /**
   * Whether the input should be read-only
   */
  readOnly?: boolean;

  /**
   * Specify whether the control has a path to a form
   * (e.g. `path="user.name"`)
   */
  path?: string;

  /**
   * Specify the type of the `<input>`
   */
  type?: string;

  /**
   * Specify the value of the `<input>`
   */
  value?: string | number;

  /**
   * Specify whether the control is currently in warning state
   */
  warn?: boolean;

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText?: React.ReactNode | FieldError | FieldErrors;

  /**
   * If true, the `<input>` will be marked as a success.
   */
  success?: boolean;

  /**
   * Text to display when the `<input>` is marked as a success.
   */
  successText?: string;

  /**
   * Optionally specify a format type for the input (e.g. phone number, currency, etc.)
   */
  formatType?: FormatType;

  /**
   * Optionally specify a custom format for the input
   */
  customFormat?: string;

  /**
   * Optionally specify a mask for the input
   */
  mask?: string;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/** Text fields allow users to input, edit, and select text or numeric values.
 * Text fields can also validate input, provide suggestions, and help users fix errors.
 */
const BaseInput = React.forwardRef(function TextInput(
  {
    className,
    register,
    rules,
    name,
    disabled = false,
    helperText,
    hideLabel,
    id,
    inline = false,
    invalid = false,
    invalidText,
    label,
    onChange = () => {},
    onClick = () => {},
    placeholder,
    readOnly,
    type = 'text',
    warn = false,
    warnText,
    success = false,
    successText,
    path,
    enableCounter = false,
    maxCount,
    required,
    formatType,
    customFormat,
    ...props
  }: BaseInputProps,
  ref,
) {
  const { defaultValue, value } = props;
  const isControlled = 'value' in props;
  const [textCount, setTextCount] = React.useState(defaultValue?.toString().length || value?.toString().length || 0);
  const [exceedsMaxCount, setExceedsMaxCount] = React.useState(false);
  const uniqueId = useId();
  const inputId = `${uniqueId}-input`;

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

  const validationMessageProps = {
    readOnly,
    invalid: normalizedProps.invalid,
    invalidText,
    warn: normalizedProps.warn,
    warnText,
    success: normalizedProps.success,
    successText,
  };

  // Modification for handleChange function to properly use customFormat
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (normalizedProps.disabled) return;

    const newValue = event.target.value;
    const config = formatType ? FORMAT_CONFIGS[formatType] : null;

    // Use formatter if available, otherwise use raw value
    let formattedValue = newValue;

    if (config?.formatter) {
      // Use standard formatter from config
      formattedValue = config.formatter(newValue);

      // Apply custom format for specific format types if provided
      if (customFormat && formatType === INPUT_FIELD_FORMAT_TYPES.Custom) {
        // For Custom format type, apply any custom formatting logic
        const customPattern = customFormat;
        const cleanedValue = newValue.replace(/\D/g, '');

        let result = '';
        let valueIndex = 0;

        for (let i = 0; i < customPattern.length && valueIndex < cleanedValue.length; i++) {
          const patternChar = customPattern[i];

          if (patternChar === '9') {
            // Digit placeholder
            if (valueIndex < cleanedValue.length) {
              result += cleanedValue[valueIndex++];
            }
          } else if (patternChar === 'a' || patternChar === 'A') {
            // Alpha placeholder (not implemented in this simple version)
            valueIndex++;
          } else {
            // Literal character in the pattern
            result += patternChar;
          }
        }

        formattedValue = result;
      } else if (customFormat && formatType === INPUT_FIELD_FORMAT_TYPES.Percent) {
        const cleanedValue = newValue.replace(/[^\d.-]/g, '');
        const number = parseFloat(cleanedValue);

        if (!isNaN(number)) {
          const decimalMatch = /\.(\d+)/.exec(customFormat);
          const decimalPlaces = decimalMatch ? decimalMatch[1].length : 2;

          formattedValue = `${number.toFixed(decimalPlaces)}%`;
        }
      } // Add to the handleChange function
      else if (customFormat && formatType === INPUT_FIELD_FORMAT_TYPES.CCNumber) {
        // Special handling for credit card number with custom format
        // The standard formatter already groups in sets of 4, but custom formats
        // might specify different groupings
        const digits = newValue.replace(/\D/g, '');

        // Apply custom format pattern
        let result = '';
        let digitIndex = 0;

        for (let i = 0; i < customFormat.length && digitIndex < digits.length; i++) {
          if (customFormat[i] === '9') {
            // Digit placeholder
            if (digitIndex < digits.length) {
              result += digits[digitIndex++];
            }
          } else {
            // Space or other separator
            result += customFormat[i];
          }
        }

        formattedValue = result;
      }
    }

    // Update character count
    if (enableCounter) {
      const newLength = formattedValue?.length || 0;
      setTextCount(newLength);
      if (maxCount !== undefined) {
        setExceedsMaxCount(newLength > maxCount);
      }
    }

    // Create synthetic event with formatted value
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        value: formattedValue,
      },
    };

    onChange(syntheticEvent);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!normalizedProps.disabled) {
      onClick(event);
    }
  };

  const renderCounter = () => {
    if (!enableCounter || maxCount === undefined) return null;

    const counterClasses = clsx(styles.label, styles.textInputLabelCounter, {
      [styles.labelDisabled]: disabled,
      [styles.textInputFieldWrapperInvalid]: exceedsMaxCount,
    });

    return <div className={counterClasses}>{`${textCount}/${maxCount}`}</div>;
  };

  const labelClasses = clsx(styles.label, {
    [styles.visuallyHidden]: hideLabel,
    [styles.labelInline]: inline,
    [styles.requiredLabel]: normalizedProps.required,
  });

  const inputWrapperClasses = clsx(className, styles.formItem, styles.textInputWrapper, {
    [styles.textInputWrapperInline]: inline,
    [styles.textInputWrapperInlineInvalid]: inline && normalizedProps.invalid,
  });

  const fieldWrapperClasses = clsx(styles.textInputFieldWrapper, {
    [styles.textInputFieldWrapperWarning]: normalizedProps.warn,
    [styles.textInputFieldWrapperInvalid]: normalizedProps.invalid,
    [styles.textInputFieldWrapperSuccess]: normalizedProps.success,
  });

  const labelElement = (
    <label
      id={`${inputId}-label`}
      htmlFor={inputId}
      className={labelClasses}
      data-required={normalizedProps.required ? 'true' : 'false'}
    >
      {label}
    </label>
  );

  const inputElement = (
    <input
      {...textInputProps({
        sharedTextInputProps: {
          id: inputId,
          onChange: handleChange,
          onClick: handleClick,
          placeholder,
          type,
          ref,
          className: clsx(styles.textInput, {
            [styles.textInputInvalid]: normalizedProps.invalid,
            [styles.textInputWarning]: normalizedProps.warn,
            [styles.textInputSuccess]: normalizedProps.success,
          }),
          defaultValue,
          value,
          path,
          title: placeholder,
          disabled: normalizedProps.disabled,
          readOnly,
          required: normalizedProps.required,
          ['aria-describedby']: helperText && normalizedProps.helperId,
          ...(enableCounter && { maxLength: maxCount }),
          ...props,
        },
        invalid: normalizedProps.invalid,
        invalidId: normalizedProps.invalidId,
        warn: normalizedProps.warn,
        warnId: normalizedProps.warnId,
        success: normalizedProps.success,
        successId: normalizedProps.successId,
      })}
      aria-labelledby={`${inputId}-label`}
      aria-label={hideLabel ? props.ariaLabel || label : undefined}
      {...(isControlled ? { value: value ?? '' } : { defaultValue })}
    />
  );

  const ariaAnnouncement = useAnnouncer(textCount, maxCount);
  const Icon = normalizedProps.icon as React.ReactElement | null;

  return (
    <div className={inputWrapperClasses}>
      {inline ? (
        <div className={styles.textInputLabelHelperWrapper}>
          {!hideLabel && (
            <div className={styles.textInputLabelWrapper}>
              {labelElement}
              {renderCounter()}
            </div>
          )}
          <ValidationMessage {...validationMessageProps} />
          {helperText && <HelperText helperText={helperText} helperId={normalizedProps.helperId} />}
        </div>
      ) : (
        <div className={styles.textInputLabelWrapper}>
          {labelElement}
          {renderCounter()}
        </div>
      )}
      <div
        className={clsx(styles.textInputFieldOuterWrapper, {
          [styles.textInputFieldOuterWrapperInline]: inline,
        })}
      >
        <div className={fieldWrapperClasses} data-invalid={normalizedProps.invalid ?? null}>
          {Icon}
          {inputElement}
          <span className={styles.textInputCounterAlert} role="alert">
            {ariaAnnouncement}
          </span>
          {inline && <ValidationMessage {...validationMessageProps} />}
        </div>
        {!inline && (
          <>
            <ValidationMessage {...validationMessageProps} />
            {helperText && <HelperText helperText={helperText} helperId={normalizedProps.helperId} />}
          </>
        )}
      </div>
    </div>
  );
});

BaseInput.displayName = 'BaseInput';

export default BaseInput;
