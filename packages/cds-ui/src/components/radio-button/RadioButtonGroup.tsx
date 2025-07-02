import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import mergeRefs from '../../utilities/merge-refs';
import setupGetInstanceId from '../../utilities/setup-get-instance-id';
import RadioButton, { RadioButtonProps } from './RadioButton';
import { HelperText } from '../helper-text';
import { ValidationMessage } from '../validation-message';
import { InputValue } from '../../global-types/input-value';
import { Text } from '../text';
import styles from './styles/RadioButton.module.css';

const getInstanceId = setupGetInstanceId();

type ExcludedAttributes = 'onChange';

export interface RadioButtonGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLFieldSetElement>, ExcludedAttributes> {
  /** Provide a collection of `<RadioButton>` components to render in the group */
  children?: ReactNode;
  /** Provide an optional className to be applied to the container node */
  className?: string;
  /** Specify the `<RadioButton>` to be selected by default */
  defaultSelected?: InputValue;
  /** Specify whether the group is disabled */
  disabled?: boolean;
  /** Provide text that is used alongside the control label for additional help */
  helperText?: ReactNode;
  /** Specify whether the control is currently invalid */
  invalid?: boolean;
  /** Provide the text that is displayed when the control is in an invalid state */
  invalidText?: ReactNode;
  /** Provide a legend to the RadioButtonGroup input that you are exposing to the user */
  legendText?: ReactNode;
  /** Specify the name of the underlying `<input>` nodes */
  name: string;
  /** Provide an optional `onChange` hook that is called whenever the value of the group changes */
  onChange?: (selection: InputValue, name: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Provide where radio buttons should be placed */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the RadioButtonGroup should be read-only */
  readOnly?: boolean;
  /** Specify whether the control is currently in warning state */
  warn?: boolean;
  /** Provide the text that is displayed when the control is in warning state */
  warnText?: ReactNode;
  /** Specify the value that is currently selected in the group */
  valueSelected?: InputValue;
  /** Optionally specify an automation id for testing purposes. */
  ['automation-id']?: string;
}

const RadioButtonGroup = React.forwardRef<HTMLDivElement, RadioButtonGroupProps>(
  (
    {
      children,
      className,
      defaultSelected,
      disabled,
      helperText,
      invalid = false,
      invalidText,
      legendText,
      name,
      onChange,
      orientation = 'horizontal',
      readOnly,
      valueSelected,
      warn = false,
      warnText,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = useState(valueSelected ?? defaultSelected);
    const radioButtonGroupInstanceId = useRef(getInstanceId()).current;
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (valueSelected !== undefined) {
        setSelected(valueSelected);
      }
    }, [valueSelected]);

    function handleOnChange(
      newSelection: InputValue,
      name: string | undefined,
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      if (!readOnly) {
        setSelected(newSelection);
        onChange?.(newSelection, name, event);
      }
    }

    const getRadioButtons = () =>
      React.Children.map(children, (child) => {
        if (React.isValidElement<RadioButtonProps>(child) && child.type === RadioButton) {
          const { value } = child.props;
          return React.cloneElement(child, {
            name: name,
            key: value,
            value: value,
            onChange: handleOnChange,
            checked: value === selected,
          });
        }
        return child;
      });

    const showWarning = !readOnly && !invalid && warn;
    const showHelper = !invalid && !disabled && !warn;

    const wrapperClasses = clsx(styles.formItem, className);

    const fieldsetClasses = clsx(styles.radioButtonGroup, {
      [styles.horizontal]: orientation === 'horizontal',
      [styles.vertical]: orientation === 'vertical',
      [styles.radioButtonGroupReadonly]: readOnly,
      [styles.radioButtonGroupInvalid]: invalid,
      [styles.radioButtonGroupWarning]: showWarning,
    });
    const helperId = !helperText ? undefined : `radio-button-group-helper-text-${radioButtonGroupInstanceId}`;

    return (
      <div className={wrapperClasses} ref={mergeRefs(divRef, ref)}>
        <fieldset
          className={fieldsetClasses}
          disabled={disabled}
          data-invalid={invalid ? true : undefined}
          aria-describedby={showHelper && helperText ? helperId : undefined}
          {...props}
        >
          {legendText && (
            <Text as="legend" className={styles.groupLabel}>
              {legendText}
            </Text>
          )}
          <div className={styles.radioButtonGroupContent}>{getRadioButtons()}</div>
        </fieldset>
        <ValidationMessage
          readOnly={readOnly}
          invalid={invalid}
          invalidText={invalidText}
          warn={warn}
          warnText={warnText}
        />
        {showHelper && <HelperText helperText={helperText} helperId={helperId} />}
      </div>
    );
  },
);

RadioButtonGroup.displayName = 'RadioButtonGroup';

export default RadioButtonGroup;
