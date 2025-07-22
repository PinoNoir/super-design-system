import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';
import { MoreVertical } from 'lucide-react';

interface SidebarMenuProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> & { Item: typeof SidebarMenuItem } = ({
  trigger,
  children,
  className,
  onOpenChange,
  isOpen: controlledOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (newOpen: boolean | ((prev: boolean) => boolean)) => {
      const resolvedOpen = typeof newOpen === 'function' ? newOpen(open) : newOpen;

      if (!isControlled) {
        setInternalOpen(resolvedOpen);
      }
      onOpenChange?.(resolvedOpen);
    },
    [open, isControlled, onOpenChange],
  );

  // Calculate menu position when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Base position: right edge of trigger
      let left = rect.right + scrollX + 8; // 8px gap from trigger
      let top = rect.top + scrollY;

      // Adjust if menu would go off-screen horizontally
      const menuWidth = 220; // min-width from CSS
      if (left + menuWidth > viewportWidth) {
        left = rect.left + scrollX - menuWidth - 8;
      }

      // Adjust if menu would go off-screen vertically
      const menuHeight = 100; // estimated min height
      if (top + menuHeight > viewportHeight) {
        top = rect.bottom + scrollY - menuHeight;
      }

      setMenuPosition({ top, left });
    } else {
      setMenuPosition(null);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const isClickOutside =
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target);

      if (isClickOutside) {
        setOpen(false);
      }
    };

    // Use capture phase to ensure we catch the event before other handlers
    document.addEventListener('mousedown', handleClick, true);
    return () => document.removeEventListener('mousedown', handleClick, true);
  }, [open, setOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        // Return focus to trigger after closing
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, setOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className={clsx(styles.iconButton, styles.sidebarMenuTrigger)}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={open}
        type="button"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger || <MoreVertical size={20} />}
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className={clsx(styles.sidebarMenuPanel, className)}
            role="menu"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 1001,
              minWidth: 220,
            }}
            onKeyDown={(e) => {
              // Handle keyboard navigation within menu
              if (e.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SidebarMenuItem) {
                return React.cloneElement(child, {
                  ...child.props,
                  onClick: (e: React.MouseEvent) => {
                    child.props.onClick?.(e);
                    // Close menu after item click unless prevented
                    if (!e.defaultPrevented) {
                      setOpen(false);
                    }
                  },
                });
              }
              return child;
            })}
          </div>,
          document.body,
        )}
    </>
  );
};

interface SidebarMenuItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ icon, children, onClick, className, disabled = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      (e.target as HTMLElement).click();
    }
  };

  return (
    <button
      className={clsx(styles.sidebarMenuItem, { [styles.disabled]: disabled }, className)}
      role="menuitem"
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {icon && <span className={styles.sidebarMenuItemIcon}>{icon}</span>}
      {children}
    </button>
  );
};

SidebarMenu.Item = SidebarMenuItem;
SidebarMenu.displayName = 'SidebarMenu';

export default SidebarMenu;
