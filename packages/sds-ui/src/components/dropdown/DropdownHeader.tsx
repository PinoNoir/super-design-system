import React, { ComponentPropsWithoutRef } from 'react';
import styles from './styles/Dropdown.module.css';

interface DropdownHeaderProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ children, ...rest }) => (
  <div {...rest} className={styles.dropdownHeader}>
    {children}
  </div>
);

export default DropdownHeader;
