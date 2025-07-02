import React, { useState, useRef, useId, useCallback } from 'react';
import { Icon } from '@iconify/react';
import DropdownItem from './DropdownItem';
import SubMenuContent from './SubMenuContent';
import DropdownHeader from './DropdownHeader';
import DropdownDivider from './DropdownDivider';
import styles from './styles/Dropdown.module.css';

export interface DropdownSubmenuProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const DropdownSubmenu: React.FC<DropdownSubmenuProps> = ({ label, children, className, icon, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const submenuContentRef = useRef<HTMLDivElement>(null);
  const submenuId = useId();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, []);

  return (
    <div
      className={`${styles.subMenu} ${className || ''}`}
      ref={submenuRef}
      role="presentation"
      onMouseLeave={handleMouseLeave}
      automation-id="dropdown-submenu"
      {...props}
    >
      <DropdownDivider />
      <DropdownItem
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        icon={icon}
        className={styles.subMenuTrigger}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={submenuId}
        tabIndex={0}
        isSubmenuTrigger={true}
      >
        <DropdownHeader>{label}</DropdownHeader>
        <Icon icon="mdi:chevron-right" className={styles.subMenuIcon} aria-hidden="true" />
      </DropdownItem>
      <SubMenuContent
        ref={submenuContentRef}
        isOpen={isOpen}
        parentRef={submenuRef}
        id={submenuId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </SubMenuContent>
    </div>
  );
};

export default DropdownSubmenu;
