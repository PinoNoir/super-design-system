import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles/FormSelect.module.css';
import { Icon } from '../icon';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id?: string;
  className?: string;
  name: string;
  value: string;
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, className, name, value, label, required, error, onChange, onBlur, onFocus, children, ...rest }, ref) => {
    return (
      <div className={styles.selectOuterWrapper}>
        {label && (
          <div className={styles.labelWrapper}>
            <label htmlFor={id} className={clsx(styles.label, { [styles.requiredLabel]: required })}>
              {label}
            </label>
          </div>
        )}
        <div className={styles.selectContainer}>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={ref}
            className={clsx(styles.select, styles.menu, { [styles.invalid]: !!error }, className)}
            aria-invalid={!!error}
            {...rest}
          >
            {children}
          </select>
          <div className={styles.customChevronWrapper}>
            <Icon name="mdi-chevron-down" size="default" aria-hidden="true" />
          </div>
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

FormSelect.displayName = 'Select';

export default FormSelect;
