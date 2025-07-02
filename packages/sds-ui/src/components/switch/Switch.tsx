import * as RadixSwitch from '@radix-ui/react-switch';
import React from 'react';
import styles from './styles/Switch.module.css';
import { clsx } from 'clsx';

export interface CustomSwitchProps extends RadixSwitch.SwitchProps {
  id?: string;
  className?: string;
  labelPosition?: 'left' | 'right';
  asChild?: boolean;
  hideLabel?: boolean;
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  inline?: boolean;
  name?: string;
  value?: string;
  ['automation-id']?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, CustomSwitchProps>((props, ref) => {
  const {
    id,
    className,
    labelPosition = 'left',
    asChild = false,
    label,
    hideLabel = false,
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    required = false,
    inline = false,
    name,
    value,
    ...rest
  } = props;

  const labelClass = clsx(styles.label, {
    [styles.visuallyHidden]: hideLabel,
    [styles.labelInline]: inline,
    [styles.requiredLabel]: required,
    [styles.labelDisabled]: disabled,
  });

  const wrapperClass = clsx({
    [styles.switchWrapper]: inline,
    [styles.switchBase]: !inline,
    [styles.labelRight]: inline && labelPosition === 'right',
    [styles.labelLeft]: inline && labelPosition === 'left',
  });

  return (
    <div className={wrapperClass}>
      {inline && label && labelPosition === 'left' && (
        <label htmlFor={id} className={labelClass} data-required={required ? 'true' : 'false'}>
          {label}
        </label>
      )}

      <RadixSwitch.Root
        id={id}
        ref={ref}
        asChild={asChild}
        className={clsx(styles.switchRoot, className)}
        disabled={disabled}
        checked={checked}
        required={required}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        value={value}
        name={name}
        {...rest}
      >
        <RadixSwitch.Thumb className={styles.switchThumb} />
      </RadixSwitch.Root>

      {inline && label && labelPosition === 'right' && (
        <label htmlFor={id} className={labelClass} data-required={required ? 'true' : 'false'}>
          {label}
        </label>
      )}

      {!inline && label && (
        <label htmlFor={id} className={labelClass} data-required={required ? 'true' : 'false'}>
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
