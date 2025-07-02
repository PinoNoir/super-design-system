import React from 'react';
import styles from './styles/TextArea.module.css';
import { clsx } from 'clsx';

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  maxCharacters: number;
  id?: string;
  className?: string;
  disabled?: boolean;
  textCounter?: boolean;
  hideLabel?: boolean;
  required?: boolean;
  helperText?: string;
  invalid?: boolean;
  helperId?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      className,
      textCounter,
      maxCharacters,
      hideLabel,
      required,
      disabled,
      label,
      helperText,
      helperId,
      invalid,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    // State for uncontrolled mode (when no value/onChange is provided)
    const [internalText, setInternalText] = React.useState<string>('');

    // Determine if we're in controlled or uncontrolled mode
    const isControlled = value !== undefined;

    // The text to display - use either controlled value or internal state
    const displayText = isControlled ? value : internalText;

    // Character count for displaying counter
    const charCount = typeof displayText === 'string' ? displayText.length : 0;

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // If controlled, call the provided onChange handler
      if (isControlled && onChange) {
        onChange(event);
      } else {
        // Otherwise update internal state
        setInternalText(event.target.value);
      }
    };

    const textAreaWrapperClasses = clsx(className, styles.formItem, styles.textAreaWrapper);
    const labelClasses = clsx(styles.label, {
      [styles.visuallyHidden]: hideLabel,
      [styles.requiredLabel]: required,
    });

    const helperTextClasses = clsx(styles.formHelperText, {
      [styles.formHelperTextDisabled]: disabled,
    });

    const counterTextClasses = clsx(styles.formCounterText, {
      [styles.formCounterTextDisabled]: disabled,
    });

    const labelElement = label ? (
      <label htmlFor={id} className={labelClasses} data-required={required}>
        {label}
      </label>
    ) : null;

    const helper = helperText ? (
      <span id={helperId} className={helperTextClasses}>
        {helperText}
      </span>
    ) : null;

    const counter = textCounter ? (
      <span className={counterTextClasses}>
        {charCount}/{maxCharacters} characters
      </span>
    ) : null;

    return (
      <div className={textAreaWrapperClasses}>
        <div className={styles.textAreaLabelWrapper}>{labelElement}</div>
        <div className={styles.textAreaFieldOuterWrapper}>
          <div className={styles.textAreaFieldWrapper} data-invalid={invalid}>
            <textarea
              ref={ref}
              id={id}
              className={styles.textArea}
              value={displayText}
              onChange={handleTextChange}
              maxLength={maxCharacters}
              disabled={disabled}
              {...props}
            />
          </div>
          <div className={styles.contentWrapper}>
            <div>{helper}</div>
            <div>{counter}</div>
          </div>
        </div>
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
