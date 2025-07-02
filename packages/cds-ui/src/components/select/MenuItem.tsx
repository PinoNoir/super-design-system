import React from 'react';
import clsx from 'clsx';
import styles from './styles/Select.module.css';
import { SelectValue } from '../../global-types/select-value';

export interface MenuItemProps {
  id?: string;
  children: React.ReactNode;
  value: SelectValue;
  disabled?: boolean;
  className?: string;
  onClick?: (value: SelectValue) => void;
  isSelected?: boolean;
  tabIndex?: number;
  iconSelected?: React.ReactNode;
  ['automation-id']?: string;
  'aria-selected'?: boolean;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  ref?: React.Ref<HTMLLIElement>;
}

const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
  { id, children, value, onClick, disabled = false, isSelected = false, tabIndex, className, iconSelected, ...props },
  forwardedRef,
) {
  const handleClick = React.useCallback(() => {
    if (!disabled) {
      onClick?.(value);
    }
  }, [disabled, onClick, value]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleClick();
      }
    },
    [handleClick],
  );

  const itemClasses = clsx(styles.item, className, {
    [styles.disabled]: disabled,
    [styles.selected]: isSelected,
  });

  return (
    <li
      id={id}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : (tabIndex ?? -1)}
      ref={forwardedRef}
      automation-id="menu-item"
      {...props}
    >
      {children}
      {isSelected && iconSelected && (
        <span automation-id="selected-icon" className={styles.iconSelected}>
          {iconSelected}
        </span>
      )}
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
