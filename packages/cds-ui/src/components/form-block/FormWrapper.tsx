import React from 'react';
import styles from './styles/FormBlock.module.css';
import { clsx } from 'clsx';

type Variant = 'base' | 'panel';

export interface FormWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  ['automation-id']?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children, variant = 'base', className, ...props }) => {
  const formWrapperStyles = clsx(styles.formWrapper, className, {
    [styles.wrapperVariantsBase]: variant === 'base',
    [styles.wrapperVariantsPanel]: variant === 'panel',
  });

  return (
    <div className={formWrapperStyles} {...props}>
      {children}
    </div>
  );
};

export default FormWrapper;
