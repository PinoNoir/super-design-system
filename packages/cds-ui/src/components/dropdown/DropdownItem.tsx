import React from 'react';
import { motion } from 'framer-motion';
import DropdownContext from './DropdownContext';
import { clsx } from 'clsx';
import { useId } from '../../utilities/use-id';
import styles from './styles/Dropdown.module.css';

export interface DropdownItemProps {
  id?: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isSubmenuTrigger?: boolean;
}

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      id,
      children,
      onClick,
      className,
      icon,
      disabled,
      onKeyDown,
      role,
      tabIndex,
      onMouseEnter,
      onMouseLeave,
      isSubmenuTrigger = false,
    },
    forwardedRef,
  ) => {
    const uid = useId('dropdown-item');
    const uniqueId = id || uid;
    const context = React.useContext(DropdownContext);
    if (!context) throw new Error('DropdownItem must be used within a Dropdown');

    const { setIsOpen } = context;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!disabled && onClick) {
        onClick();
        if (!isSubmenuTrigger) {
          setIsOpen(false);
        }
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as unknown as React.MouseEvent);
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    };

    return (
      <motion.div
        id={uniqueId}
        ref={forwardedRef}
        role={role || 'menuitem'}
        className={clsx(className, styles.menuItem)}
        onClick={handleClick}
        onKeyDown={onKeyDown || handleKeyDown}
        tabIndex={tabIndex || disabled ? -1 : 0}
        data-state={disabled ? 'disabled' : ''}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        automation-id="dropdown-item"
      >
        {icon && <span className={styles.menuItemIcon}>{icon}</span>}
        {children}
      </motion.div>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
