import React, { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import styles from './styles/Form.module.css';
import { Loader } from '../loader';
import { Rules } from './types/form-rules';

export interface MuiValidationRules {
  required?: { value: boolean; message: string };
  minlength?: { value: number; message: string };
  maxlength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: { value: (value: any) => boolean | string };
}

export interface FormControlProps {
  path: string;
  label?: string;
  rules?: Rules[];
}

export interface FormProps extends ComponentPropsWithoutRef<'form'> {
  id?: string;
  children?: React.ReactNode | React.ReactNode[];
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onReset?: React.FormEventHandler<HTMLFormElement>;
  header?: string;
  className?: string;
  helperText?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  ['automation-id']?: string;
}

const Form = ({
  id,
  children,
  onSubmit,
  onReset,
  header,
  footer,
  className,
  helperText,
  isLoading,
  ...props
}: Readonly<FormProps>) => {
  const formStyles = clsx(styles.form, className);
  const baseStyles = clsx(styles.formContent, className);

  return (
    <div className={formStyles}>
      <form
        id={id}
        className={baseStyles}
        onSubmit={onSubmit}
        onReset={onReset}
        automation-id={props['automation-id'] || 'form'}
        {...props}
      >
        <div className={styles.formHeader}>
          {header && <h2>{header}</h2>}
          {helperText && <div className={styles.helperText}>{helperText}</div>}
        </div>
        <div className={styles.innerContent}>
          {isLoading && <Loader withOverlay={true} />}
          {children}
        </div>
        {footer}
      </form>
    </div>
  );
};

Form.displayName = 'Form';

export default Form;
