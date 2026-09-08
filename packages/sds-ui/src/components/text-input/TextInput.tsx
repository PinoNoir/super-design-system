import React, { useState } from 'react';
import { clsx } from 'clsx';
import styles from './styles/TextInput.module.css';
import { ValidationMessage } from '../validation-message';
import { HelperText } from '../helper-text';
import { useId } from '../../utilities/use-id';
import { useAnnouncer } from '../../utilities/use-announcer';
import { useFieldStatus, FieldStatus } from '../../hooks';
import { FieldError, FieldErrors } from 'react-hook-form';

type ExcludedAttributes = 'defaultValue' | 'id' | 'value';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAttributes> {
  /**
   * Specify an optional className to be applied to the `<input>` node
   */
  className?: string;

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue?: string | number;

  name?: string;

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
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const STATUS_ICON_CLASSNAMES: Record<Exclude<FieldStatus, null>, string> = {
  invalid: styles.errorIcon,
  warn: styles.warningIcon,
  success: styles.successIcon,
};

/** Text fields allow users to input, edit, and select text or numeric values.
 * Text fields can also validate input, provide suggestions, and help users fix errors.
 */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      name,
      disabled = false,
      helperText,
      hideLabel,
      id,
      inline = false,
      invalid = false,
      invalidText,
      label,
      onChange: customOnChange,
      onClick,
      placeholder,
      readOnly,
      type = 'text',
      warn = false,
      warnText,
      success = false,
      successText,
      enableCounter = false,
      maxCount,
      required,
      defaultValue,
      value,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolledCount, setUncontrolledCount] = useState(() => String(defaultValue ?? '').length);
    const textCount = isControlled ? String(value ?? '').length : uncontrolledCount;
    const exceedsMaxCount = maxCount !== undefined && textCount > maxCount;

    const uniqueId = useId();
    const inputId = `${uniqueId}-input`;

    const fieldStatus = useFieldStatus({ id, disabled, readOnly, required, invalid, warn, success });

    const validationMessageProps = {
      readOnly,
      invalid: fieldStatus.invalid,
      invalidText,
      warn: fieldStatus.warn,
      warnText,
      success: fieldStatus.success,
      successText,
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (fieldStatus.disabled) return;

      if (!isControlled) {
        setUncontrolledCount(event.target.value.length);
      }

      customOnChange?.(event);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!fieldStatus.disabled) {
        onClick?.(event);
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
      [styles.requiredLabel]: fieldStatus.required,
    });

    const inputWrapperClasses = clsx(className, styles.formItem, styles.textInputWrapper, {
      [styles.textInputWrapperInline]: inline,
      [styles.textInputWrapperInlineInvalid]: inline && fieldStatus.invalid,
    });

    const fieldWrapperClasses = clsx(styles.textInputFieldWrapper, {
      [styles.textInputFieldWrapperWarning]: fieldStatus.warn,
      [styles.textInputFieldWrapperInvalid]: fieldStatus.invalid,
      [styles.textInputFieldWrapperSuccess]: fieldStatus.success,
    });

    // Associate the input with whichever status message and/or helper text
    // is actually rendered, so screen reader users hear it too - not just
    // see it. Both can be present at once (aria-describedby accepts a
    // space-separated list of ids).
    const describedBy =
      [fieldStatus.status ? fieldStatus[`${fieldStatus.status}Id`] : null, helperText ? fieldStatus.helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const labelElement = (
      <label
        id={`${inputId}-label`}
        htmlFor={inputId}
        className={labelClasses}
        data-required={fieldStatus.required ? 'true' : 'false'}
      >
        {label}
      </label>
    );

    const inputElement = (
      <input
        {...props}
        id={inputId}
        name={name}
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={fieldStatus.disabled}
        readOnly={readOnly}
        required={fieldStatus.required}
        className={clsx(styles.textInput, {
          [styles.textInputInvalid]: fieldStatus.invalid,
          [styles.textInputWarning]: fieldStatus.warn,
          [styles.textInputSuccess]: fieldStatus.success,
        })}
        onChange={handleChange}
        onClick={handleClick}
        aria-labelledby={`${inputId}-label`}
        aria-label={hideLabel ? ariaLabel || label : undefined}
        aria-describedby={describedBy}
        aria-invalid={fieldStatus.invalid || undefined}
        {...(isControlled ? { value: value ?? '' } : { defaultValue })}
        {...(enableCounter && maxCount !== undefined ? { maxLength: maxCount } : {})}
      />
    );

    const ariaAnnouncement = useAnnouncer(textCount, maxCount);
    const StatusIcon = fieldStatus.StatusIcon;

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
            {helperText && <HelperText helperText={helperText} helperId={fieldStatus.helperId} />}
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
          <div className={fieldWrapperClasses} data-invalid={fieldStatus.invalid ?? null}>
            {StatusIcon && (
              <StatusIcon
                className={fieldStatus.status ? STATUS_ICON_CLASSNAMES[fieldStatus.status] : undefined}
                focusable="false"
                aria-hidden="true"
              />
            )}
            {inputElement}
            <span className={styles.textInputCounterAlert} role="alert">
              {ariaAnnouncement}
            </span>
            {inline && <ValidationMessage {...validationMessageProps} />}
          </div>
          {!inline && (
            <>
              <ValidationMessage {...validationMessageProps} />
              {helperText && <HelperText helperText={helperText} helperId={fieldStatus.helperId} />}
            </>
          )}
        </div>
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
