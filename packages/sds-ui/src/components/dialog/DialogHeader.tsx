import { Icon } from '@iconify/react';
import styles from './styles/Dialog.module.css';

export interface DialogHeaderProps {
  title: string;
  hideCloseButton?: boolean;
  onClose?: () => void;
  firstFocusableElement?: React.RefObject<HTMLButtonElement>;
  ['automation-id']?: string;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, hideCloseButton, onClose, firstFocusableElement }) => {
  return (
    <>
      <span id="dialog-title" className={styles.dialogTitle}>
        {title}
      </span>
      {hideCloseButton ? (
        <></>
      ) : (
        <button
          aria-label="Close dialog"
          className={styles.dialogClose}
          onClick={onClose}
          ref={firstFocusableElement}
          automation-id="close-dialog"
        >
          <Icon icon="mdi:close" width="20px" />
        </button>
      )}
    </>
  );
};

export default DialogHeader;
