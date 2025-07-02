import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DropdownContext from './DropdownContext';
import { clsx } from 'clsx';
import mergeRefs from '../../utilities/merge-refs';
import styles from './styles/Dropdown.module.css';

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(({ children, className }, forwardedRef) => {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(DropdownContext);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsOpen, triggerRef]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Get menu height - if we can't get it yet, make a reasonable assumption
      const menuHeight = dropdownRef.current?.offsetHeight || 200;
      const menuWidth = dropdownRef.current?.offsetWidth || 200;

      // Calculate available space
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Default position (below trigger)
      let top = triggerRect.bottom + window.scrollY;
      let left = triggerRect.left + window.scrollX;

      // If not enough space below, and more space above, position above
      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        top = triggerRect.top - menuHeight + window.scrollY;
      }

      // Prevent right overflow
      if (triggerRect.left + menuWidth > viewportWidth) {
        left = triggerRect.right - menuWidth + window.scrollX;
      }

      setPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const menuItems = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
      if (menuItems) {
        const currentIndex = Array.from(menuItems).findIndex((item) => item === document.activeElement);
        const nextIndex =
          event.key === 'ArrowDown'
            ? (currentIndex + 1) % menuItems.length
            : (currentIndex - 1 + menuItems.length) % menuItems.length;
        (menuItems[nextIndex] as HTMLElement).focus();
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={mergeRefs(dropdownRef, forwardedRef)}
          role="menu"
          className={clsx(className, styles.menu)}
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={dropdownVariants}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
