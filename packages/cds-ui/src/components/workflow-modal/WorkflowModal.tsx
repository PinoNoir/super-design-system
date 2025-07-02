import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import styles from './styles/Workflowmodal.module.css';

export interface WorkflowModalProps {
  id?: string;
  title: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const WorkflowModal = ({ id, title, footer, children, isOpen, onClose }: WorkflowModalProps) => {
  const modalVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, type: 'spring', velocity: 2 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  // Escape key event listener
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.wrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className={styles.flyoutPanel}
            id={id}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.header}>
              <span className={styles.title}>{title}</span>
              <button onClick={onClose} aria-label="Close panel">
                <Icon icon="mdi:close" />
              </button>
            </div>
            <div className={styles.content}>{children}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

WorkflowModal.displayName = 'WorkflowModal';

export default WorkflowModal;
