import { Button } from '../button';
import styles from './styles/Dialog.module.css';

export interface DialogFooterProps {
  onClose: () => void;
  onSave?: () => void;
  continueButtonLabel?: string;
  cancelButtonLabel?: string;
  singleButtonLabel?: string;
  singleButton?: boolean;
  isDeleteAction?: boolean;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  onSave,
  onClose,
  continueButtonLabel,
  cancelButtonLabel,
  singleButton,
  singleButtonLabel,
  isDeleteAction,
}) => {
  return (
    <footer className={styles.dialogFooter}>
      <div className={styles.dialogFooterContent}>
        {singleButton ? (
          <Button variant="primary" onClick={onClose}>
            {singleButtonLabel || 'OK'}
          </Button>
        ) : (
          <>
            {isDeleteAction ? (
              <Button variant="danger" fill="outline" onClick={onSave}>
                {continueButtonLabel || 'Delete'}
              </Button>
            ) : (
              <Button variant="primary" onClick={onSave}>
                {continueButtonLabel || 'Continue'}
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              {cancelButtonLabel || 'Cancel'}
            </Button>
          </>
        )}
      </div>
    </footer>
  );
};

export default DialogFooter;
