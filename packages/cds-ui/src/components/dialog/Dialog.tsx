import React from 'react';
import { clsx } from 'clsx';
import styles from './styles/Dialog.module.css';

export interface DialogProps extends React.ComponentPropsWithoutRef<'dialog'> {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  width?: 'small' | 'medium' | 'large';
  onClose?: () => void;
  ['automation-id']?: string;
}

/** Dialogs are used to present important information or request user input without navigating away from the current page or context. */
const Dialog: React.FC<DialogProps> = ({ children, className, open, width, onClose, ...props }) => {
  const firstFocusableElement = React.useRef(null);
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      firstFocusableElement.current?.focus();
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleTabKey = (e) => {
    const focusableDialogElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableDialogElements[0];
    const lastElement = focusableDialogElements[focusableDialogElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  };

  if (!open) return null;

  const dialogClasses = clsx(className, styles.dialog, {
    [styles.small]: width === 'small',
    [styles.medium]: width === 'medium',
    [styles.large]: width === 'large',
  });

  return (
    <div id="dialog" className={styles.dialogOverlay}>
      <dialog
        className={dialogClasses}
        open={open}
        aria-modal="true"
        aria-labelledby="dialog"
        ref={dialogRef}
        onKeyDown={handleTabKey}
        {...props}
      >
        {children}
      </dialog>
    </div>
  );
};

export default Dialog;
