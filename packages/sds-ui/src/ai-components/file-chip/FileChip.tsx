import React from 'react';
import styles from './styles/FileChip.module.css';
import { Loader } from '../../components/loader';
import { CloseIcon } from '../../components/icon';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import { getFileTypeIcon } from '../../utilities/file-icons';

export type FileChipProps = {
  file: File;
  onRemove?: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  status?: 'base' | 'error' | 'success';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileChip: React.FC<FileChipProps> = ({
  file,
  onRemove,
  onRetry,
  isLoading = false,
  loadingIndicator,
  status = 'base',
  className,
  style,
  children,
}) => {
  let actionButton: React.ReactNode = null;

  if (!isLoading) {
    if (status === 'error' && onRetry) {
      actionButton = (
        <button onClick={onRetry} className={styles.retryButton} aria-label="Retry upload">
          <Icon icon="mdi:reload" />
        </button>
      );
    } else if (onRemove) {
      actionButton = (
        <button onClick={onRemove} className={styles.removeButton} aria-label="Remove file">
          <CloseIcon />
        </button>
      );
    }
  }

  return (
    <div className={clsx(styles.chip, styles[status], className)} style={style}>
      <div className={styles.infoWrapper}>
        <div className={styles.fileIconWrapper}>
          {isLoading
            ? (loadingIndicator ?? <Loader size={30} />)
            : getFileTypeIcon(file.name, file.type, {
                className: styles.fileTypeIcon,
                width: '20px',
              })}
        </div>
        <div className={styles.fileInfo}>
          <div className={styles.fileName}>{file.name}</div>
          <div className={styles.fileMetaData}>{formatBytes(file.size)}</div>
          {children}
        </div>
        <div className={styles.actionButtons}>{actionButton}</div>
      </div>
    </div>
  );
};

export default FileChip;
