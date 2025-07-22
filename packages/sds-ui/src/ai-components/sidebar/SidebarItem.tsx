import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  active?: boolean;
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

  // Show actions when item is hovered OR menu is open
  const showActions = (isHovered || menuOpen) && !collapsed && !disabled;

  const handleMouseEnter = () => {
    if (!disabled) {
      // Clear any pending hide timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    // Only hide after a small delay if menu is not open
    if (!menuOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 150); // Small delay to allow moving to the menu trigger
    }
  };

  const handleActionsMouseEnter = () => {
    // Keep actions visible when hovering over them
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleActionsMouseLeave = () => {
    // Hide actions when leaving the actions area (unless menu is open)
    if (!menuOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  };

  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open);
    // If menu closes, allow hiding after a delay
    if (!open) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    } else {
      // If menu opens, ensure actions stay visible
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  // Cleanup timeout on unmount
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

  // Enhanced menu cloning with proper props
  let enhancedMenu = customMenu;
  if (customMenu && React.isValidElement(customMenu)) {
    const menuProps: any = {
      ...customMenu.props,
      onOpenChange: handleMenuOpenChange,
    };

    // Handle different menu component types
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
          [styles.active]: active,
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
