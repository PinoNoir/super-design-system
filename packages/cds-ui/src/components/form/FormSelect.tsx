import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles/FormSelect.module.css';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id?: string;
  className?: string;
  name: string;
  value: string;
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, className, name, value, label, required, error, onChange, onBlur, children, ...rest }, ref) => {
    return (
      <div className={styles.selectOuterWrapper}>
        {label && (
          <div className={styles.labelWrapper}>
            <label htmlFor={id} className={clsx(styles.label, { [styles.requiredLabel]: required })}>
              {label}
            </label>
          </div>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          className={clsx(styles.select, { [styles.invalid]: !!error }, className)}
          aria-invalid={!!error}
          {...rest}
        >
          {children}
        </select>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

FormSelect.displayName = 'Select';

export default FormSelect;
