import React, { useCallback, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import styles from './styles/Modal.module.css';
import ModalBody from './ModalBody';
import { Button } from '../button';
import { ButtonProps } from '../button/Button';
import { useRoveFocus } from '../../hooks';

// Define more specific button types
export type BaseButtonConfig = {
  text: string;
  disabled?: boolean;
  autoClose?: boolean;
  ['automation-id']?: string;
  props?: ButtonProps;
};

export type PrimaryButtonConfig = BaseButtonConfig & {
  variant: 'primary';
  onClick?: () => void;
};

export type SecondaryButtonConfig = BaseButtonConfig & {
  variant: 'secondary';
  onClick?: () => void;
};

export type TertiaryButtonConfig = BaseButtonConfig & {
  variant: 'tertiary';
  onClick?: () => void;
};

export type ButtonConfig = PrimaryButtonConfig | SecondaryButtonConfig | TertiaryButtonConfig;

export interface ModalProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  title: string;
  trigger?: React.ReactNode;
  open?: boolean;
  disableCloseOnOverlayClick?: boolean;
  disableClose?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  width?: 'small' | 'medium' | 'large';
  actionButtons?: Array<ButtonConfig>;
  saveButtonLabel?: string;
  closeButtonLabel?: string;
  disablePrimaryButton?: boolean;
  ['automation-id']?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveButtonProps?: ButtonProps;
  closeButtonProps?: ButtonProps;
}

const Modal: React.FC<ModalProps> = ({
  children,
  footer,
  className,
  title,
  trigger,
  disablePrimaryButton = false,
  actionButtons = [],
  closeButtonLabel = 'Cancel',
  saveButtonLabel = 'Save',
  disableCloseOnOverlayClick,
  disableClose = false,
  initialFocus,
  width,
  open,
  onClose,
  onSave,
  saveButtonProps,
  closeButtonProps,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    );
  };

  const focusableElements = getFocusableElements();
  const [currentFocus, setCurrentFocus] = useRoveFocus(focusableElements.length);

  // Effect to focus the element when currentFocus changes
  useEffect(() => {
    if (open && focusableElements.length > 0 && focusableElements[currentFocus]) {
      (focusableElements[currentFocus] as HTMLElement).focus();
    }
  }, [currentFocus, open, focusableElements]);

  // Handle body overflow
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.style.overflow = '';
      document.body.setAttribute('data-modal-open', 'false');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-modal-open');
    };
  }, [open]);

  // Set initial focus when modal opens
  useEffect(() => {
    if (open) {
      const elementToFocus = initialFocus?.current || closeButtonRef.current;
      setTimeout(() => {
        elementToFocus?.focus();
      }, 0);
    }
  }, [open, initialFocus]);

  // A method that always closes
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // A method that conditionally closes based on the props
  const handleRequestClose = useCallback(() => {
    if (!disableClose) {
      handleClose();
    }
  }, [disableClose, handleClose]);

  const handleEscapeKey = useCallback(() => {
    if (!disableClose) {
      handleRequestClose();
    }
  }, [disableClose, handleRequestClose]);

  // This handler doesn't need the conditional check
  const handleTabKey = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();
      if (event.shiftKey) {
        setCurrentFocus(currentFocus === 0 ? focusableElements.length - 1 : currentFocus - 1);
      } else {
        setCurrentFocus(currentFocus === focusableElements.length - 1 ? 0 : currentFocus + 1);
      }
    },
    [currentFocus, focusableElements.length, setCurrentFocus],
  );

  // Main keydown handler that delegates to the appropriate specialized handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEscapeKey();
      } else if (event.key === 'Tab') {
        handleTabKey(event);
      }
    },
    [handleEscapeKey, handleTabKey],
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && !disableCloseOnOverlayClick) {
        handleRequestClose();
      }
    },
    [handleRequestClose, disableCloseOnOverlayClick],
  );

  const modalClasses = clsx(className, styles.modal, {
    [styles.small]: width === 'small',
    [styles.medium]: width === 'medium',
    [styles.large]: width === 'large',
  });

  const renderButton = useCallback((buttonConfig: ButtonConfig, index: number) => {
    const { text, variant, onClick, disabled } = buttonConfig;
    return (
      <Button
        key={index}
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        automation-id={buttonConfig['automation-id']}
        {...buttonConfig.props}
      >
        {text}
      </Button>
    );
  }, []);

  const footerClasses = footer ? styles.customFooter : styles.modalFooter;

  if (!open && !trigger) {
    return null;
  }

  const modalContent = open && (
    <div
      className={styles.modalOverlay}
      role="presentation"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      automation-id="modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={modalClasses}
        ref={modalRef}
        {...props}
      >
        <button
          className={styles.modalClose}
          onClick={handleRequestClose}
          aria-label="Close modal"
          ref={closeButtonRef}
          disabled={disableClose}
        >
          <Icon icon="mdi:close" />
        </button>
        <h2 id="modal-title" className={styles.modalTitle}>
          {title}
        </h2>
        <ModalBody id="modal-body">{children}</ModalBody>
        <div className={footerClasses}>
          {footer || (
            <>
              <div className={styles.secondaryActions}>{actionButtons.map(renderButton)}</div>
              <div className={styles.defaultActions}>
                <Button variant="primary" disabled={disablePrimaryButton} onClick={onSave} {...saveButtonProps}>
                  {saveButtonLabel}
                </Button>
                <Button variant="secondary" onClick={handleRequestClose} disabled={disableClose} {...closeButtonProps}>
                  {closeButtonLabel}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {trigger}
      {modalContent}
    </>
  );
};

Modal.displayName = 'Modal';

export default Modal;
