import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import styles from './styles/Dialog.module.css';
import { useFocusTrap } from '../../hooks';

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Focus trap: computes focusable elements after mount, moves initial focus
  // in (native showModal() below does this too, but this also restores focus
  // to whatever was focused before the dialog opened) and cycles Tab/Shift+Tab.
  useFocusTrap({
    rootElement: dialogRef,
    isActive: open,
    enableArrowKeyNavigation: false,
  });

  // Make this an actual native modal dialog: showModal() promotes it to the
  // top layer and removes the rest of the page from the accessibility tree
  // and tab order, which setting the `open` attribute alone does not do.
  // JSDOM (used in tests) doesn't implement showModal()/close(), so fall
  // back to toggling the attribute directly there instead of throwing.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }, [open]);

  // A showModal()'d dialog also closes itself natively on Escape (firing
  // 'cancel' first). Prevent that so `open` stays controlled by the caller -
  // the keydown listener below is the single thing that calls onClose().
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => event.preventDefault();
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const dialogClasses = clsx(className, styles.dialog, {
    [styles.small]: width === 'small',
    [styles.medium]: width === 'medium',
    [styles.large]: width === 'large',
  });

  return (
    <div id="dialog" className={styles.dialogOverlay}>
      <dialog className={dialogClasses} aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef} {...props}>
        {children}
      </dialog>
    </div>
  );
};

export default Dialog;
