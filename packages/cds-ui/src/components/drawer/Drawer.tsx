import React, { useState, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import styles from './styles/Drawer.module.css';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

// Define a ref type that exposes methods for controlling the drawer
export interface DrawerHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, type: 'spring', velocity: 2 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const Drawer = React.forwardRef<DrawerHandle, DrawerProps>(
  ({ children, className, open: controlledOpen, defaultOpen = false, onClose, onOpenChange }, forwardedRef) => {
    // Use state for uncontrolled component behavior
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

    // Determine if component is controlled by parent or self-managed
    const isControlled = controlledOpen !== undefined;

    // Actual open state that's used for rendering
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    // Handle for external calls
    const drawerRef = useRef(null);

    // Method to close the drawer
    const close = useCallback(() => {
      if (!isControlled) {
        setUncontrolledOpen(false);
      }
      onOpenChange?.(false);
      onClose?.();
    }, [isControlled, onClose, onOpenChange]);

    // Method to open the drawer
    const open = useCallback(() => {
      if (!isControlled) {
        setUncontrolledOpen(true);
      }
      onOpenChange?.(true);
    }, [isControlled, onOpenChange]);

    // Method to toggle the drawer
    const toggle = useCallback(() => {
      if (!isControlled) {
        setUncontrolledOpen((prev) => !prev);
      }
      onOpenChange?.(!isOpen);
    }, [isControlled, isOpen, onOpenChange]);

    // Expose methods via ref
    useImperativeHandle(forwardedRef, () => ({
      open,
      close,
      toggle,
      isOpen: () => isOpen,
    }));

    // Sync with controlled prop changes
    useEffect(() => {
      if (isControlled && controlledOpen !== isOpen) {
        onOpenChange?.(controlledOpen);
      }
    }, [controlledOpen, isControlled, isOpen, onOpenChange]);

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={clsx(styles.drawerContainer, className)}
            automation-id="drawer-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={drawerRef}
              automation-id="drawer-content-wrapper"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                className={styles.closeButton}
                onClick={close}
                automation-id="close-button"
                aria-label="Close drawer"
              >
                <Icon icon="mdi:close" width="20px" color="var(--theme-icon-base)" />
              </button>
              <div className={styles.drawerContent}>{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

Drawer.displayName = 'Drawer';

export default Drawer;
