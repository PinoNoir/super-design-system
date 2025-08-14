import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  active?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  collapsed?: boolean;
  customMenu?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

const SidebarItem = ({
  icon,
  label,
  badge,
  active,
  isActive,
  disabled,
  className,
  collapsed = false,
  customMenu,
  href = '#',
  onClick,
  ...props
}: SidebarItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isItemActive = isActive !== undefined ? isActive : active;

  const showActions = (isHovered || menuOpen) && !collapsed && !disabled;

  const handleMouseEnter = () => {
    if (!disabled) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!menuOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 150);
    }
  };

  const handleActionsMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleActionsMouseLeave = () => {
    if (!menuOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  };

  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open);
    if (!open) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMainClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  let enhancedMenu = customMenu;
  if (customMenu && React.isValidElement(customMenu)) {
    const menuProps: any = {
      ...customMenu.props,
      onOpenChange: handleMenuOpenChange,
    };

    const componentType = (customMenu.type as any)?.displayName || customMenu.type;
    if (componentType === 'SidebarMenu' || componentType === 'Dropdown') {
      menuProps.isOpen = menuOpen;
    }

    enhancedMenu = React.cloneElement(customMenu, menuProps);
  }

  return (
    <li
      className={clsx(
        styles.navButton,
        {
          [styles.active]: isItemActive,
          [styles.disabled]: disabled,
        },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-menu-open={menuOpen}
      {...props}
    >
      <a
        className={styles.mainAction}
        href={href}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        role="menuitem"
        onClick={handleMainClick}
      >
        {icon && <span className={styles.iconButton}>{icon}</span>}
        {!collapsed && <span className={styles.navLabel}>{label}</span>}
        {!collapsed && badge && <span className={styles.navBadge}>{badge}</span>}
      </a>

      {customMenu && (
        <span
          className={clsx(styles.navActions, { [styles.navActionsVisible]: showActions })}
          onMouseEnter={handleActionsMouseEnter}
          onMouseLeave={handleActionsMouseLeave}
        >
          {enhancedMenu}
        </span>
      )}
    </li>
  );
};

SidebarItem.displayName = 'SidebarItem';

export default SidebarItem;
