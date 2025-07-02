import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from './styles/StatusMessage.module.css';

export interface StatusMessageProps {
  type: 'error' | 'success';
  message: string;
  icon: string;
  onDismiss: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, icon, onDismiss }) => {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
      exit={{ x: 50, opacity: 0, transition: { duration: 0.1, ease: 'easeOut' } }}
      role="status"
      aria-live="polite"
      className={type === 'error' ? styles.errorMessageContainer : styles.successMessageContainer}
    >
      <div className={styles.iconContainer}>
        <Icon icon={`mdi:${icon}`} width="20px" />
        {message}
      </div>
      <button className={styles.dismissButton} aria-label="Dismiss message" onClick={onDismiss}>
        <Icon icon="mdi:close" width="20px" />
      </button>
    </motion.div>
  );
};

export default StatusMessage;
