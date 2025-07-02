import React from 'react';
import styles from './styles/HelperText.module.css';

export interface HelperTextProps {
  helperText: React.ReactNode;
  helperId: string | undefined;
}

const HelperText: React.FC<HelperTextProps> = ({ helperText, helperId }) => (
  <div id={helperId} className={styles.formHelperText}>
    {helperText}
  </div>
);

export default HelperText;
