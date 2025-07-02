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
   * Specify whether the label has an icon
   */
  hasIcon?: boolean;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const Label: React.FC<LabelProps> = ({ hasIcon, children, ...props }) => {
  return (
    <Box display="flex">
      <label className={styles.label} {...props}>
        {children}
      </label>
      {!hasIcon ? (
        <Box display="flex" alignItems="center">
          {hasIcon}
        </Box>
      ) : null}
    </Box>
  );
};

Label.displayName = 'Label';

export default Label;
