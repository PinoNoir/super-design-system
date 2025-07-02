import { clsx } from 'clsx';
import React, { useRef } from 'react';
import mergeRefs from '../../utilities/merge-refs';
import { useId } from '../../utilities/use-id';
import Text from '../text/Text';
import styles from './styles/RadioButton.module.css';
import { InputValue } from '../../global-types/input-value';

type ExcludedAttributes = 'onChange';

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAttributes> {
  /** Specify whether the `<RadioButton>` is currently checked */
  checked?: boolean;
  /** Provide an optional className to be applied to the containing node */
  className?: string;
  /** Specify whether the `<RadioButton>` should be checked by default */
  defaultChecked?: boolean;
  /** Specify whether the control is disabled */
  disabled?: boolean;
  /** Specify whether the label should be hidden, or not */
  hideLabel?: boolean;
  /** Provide a unique id for the underlying `<input>` node */
  id?: string;
  /** Provide label text to be read by screen readers when interacting with the control */
  label: React.ReactNode;
  /** Provide a name for the underlying `<input>` node */
  name?: string;
  /** Provide an optional `onChange` hook that is called each time the value of the underlying `<input>` changes */
  onChange?: (value: InputValue, name: string | undefined, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Provide a handler that is invoked when a user clicks on the control */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  /** Specify the value of the `<RadioButton>` */
  value?: InputValue;
  /** Optionally specify an automation id for testing purposes. */
  ['automation-id']?: string;
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    { className, disabled, hideLabel, id, label = '', checked, name, onClick, onChange, value, ...props },
    forwardedRef,
  ) => {
    const uid = useId('radio-button');
    const uniqueId = id || uid;

    const wrapperClasses = clsx(styles.radioButtonWrapper, className);

    const innerLabelClasses = clsx(styles.radioButtonLabel, {
      [styles.visuallyHidden]: hideLabel,
    });

    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className={wrapperClasses}>
        <input
          {...props}
          className={styles.radioButton}
          type="radio"
          onChange={(e) => onChange?.(value, name, e)}
          onClick={onClick}
          id={uniqueId}
          ref={mergeRefs(inputRef, forwardedRef)}
          disabled={disabled}
          value={value}
          name={name}
          checked={checked}
        />
        <label htmlFor={uniqueId} className={styles.radioButtonLabel}>
          <span className={styles.radioButtonAppearance} />
          {label && (
            <Text as="span" className={innerLabelClasses}>
              {label}
            </Text>
          )}
        </label>
      </div>
    );
  },
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;
