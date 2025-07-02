import { clsx } from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './styles/Divider.module.css';

export interface DividerProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optionally apply a custom CSS class to the `<Divider>`.
   */
  className?: string;

  /**
   * Specify a thickness for the `<Divider>`.
   */
  thickness?: 'thin' | 'medium' | 'thick';

  /**
   * Specify an orientation for the `<Divider>`.
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/* Dividers are used to separate content within a layout. */
const Divider = ({ className, thickness = 'medium', orientation = 'horizontal', ...props }: DividerProps) => {
  const dividerClasses = clsx(styles.divider, className, {
    [styles.thin]: thickness === 'thin',
    [styles.medium]: thickness === 'medium',
    [styles.thick]: thickness === 'thick',
    [styles.horizontal]: orientation === 'horizontal',
    [styles.vertical]: orientation === 'vertical',
  });

  return <div role="separator" className={dividerClasses} {...props} />;
};

Divider.displayName = 'Divider';

export default Divider;
