import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Box } from '../box';
import styles from './styles/Label.module.css';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  /**
   * Pass in children (the label text)
   */
  children: ReactNode;

  /**
   * Specify a custom CSS class for the parent element
   */
  className?: string;

  /**
   * Optional icon to display after the label text
   */
  icon?: ReactNode;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const Label: React.FC<LabelProps> = ({ icon, children, ...props }) => {
  return (
    <Box className={styles.wrapper}>
      <label className={styles.label} {...props}>
        {children}
      </label>
      {icon && (
        <Box display="flex" alignItems="center">
          {icon}
        </Box>
      )}
    </Box>
  );
};

Label.displayName = 'Label';

export default Label;
