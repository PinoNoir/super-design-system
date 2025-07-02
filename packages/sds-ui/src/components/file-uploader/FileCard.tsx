import React, { ComponentPropsWithRef, useRef } from 'react';
import { FileStatus, FileWithStatus } from '../../global-types/file-status';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from '../dropdown';
import { ProgressBar } from '../progress-bar';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import styles from './styles/FileCard.module.css';
import { IconButton } from '../icon-button';
import { useId } from '../../utilities/use-id';
import { getFileTypeIcon } from '../../utilities/file-icons';

export interface FileCardProps extends ComponentPropsWithRef<'div'> {
  id?: string;
  children?: React.ReactNode;
  metaData?: string;
  file: FileWithStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onRetryUpload?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  ['automation-id']?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  id,
  metaData,
  onEdit,
  onDelete,
  onDownload,
  onUploadProgress,
  onRetryUpload,
  file,
  ...props
}) => {
  const { status, progress, message } = file;

  const fileName = file.fileInfo instanceof File ? file.fileInfo.name : (file.fileInfo?.name ?? 'Unknown file');
  const fileSize = file.size ?? (file.fileInfo instanceof File ? file.fileInfo.size : (file.fileInfo?.size ?? 0));
  const fileType = file.fileInfo instanceof File ? file.fileInfo.type : file.fileInfo?.type;

  const showMessage =
    status === FileStatus.Uploading ||
    status === FileStatus.Complete ||
    status === FileStatus.Failed ||
    status === FileStatus.ValidationFailed;

  const fileCardRef = useRef(null);
  const uniqueId = useId('file-card');

  // Determine if we should show the menu based on whether any handlers are provided
  const hasMenuActions = !!(onEdit || onDelete || onDownload);

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size >= 1024 && size < 1048576) {
      return (size / 1024).toFixed(1) + ' KB';
    } else if (size >= 1048576) {
      return (size / 1048576).toFixed(1) + ' MB';
    }
  };

  const handleRetry = () => {
    if (onRetryUpload && file?.file) {
      onRetryUpload(file.file);
    }
  };

  const getFileStatusIcon = (status: FileStatus): React.ReactElement => {
    switch (status) {
      case FileStatus.Failed:
      case FileStatus.ValidationFailed:
        return (
          <>
            <Icon icon="mdi:alert-rhombus" width="20px" color="var(--theme-icon-error)" />
            <button aria-label="Retry file upload" onClick={handleRetry} className={styles.retryButton}>
              <Icon icon="mdi:reload" width="20px" color="var(--theme-icon-base)" />
            </button>
          </>
        );
      default:
        return <></>;
    }
  };

  const messageClass = clsx({
    [styles.defaultMessageContainer]: status === FileStatus.Uploading,
    [styles.successMessageContainer]: status === FileStatus.Complete,
    [styles.errorMessageContainer]: status === FileStatus.Failed || status === FileStatus.ValidationFailed,
  });

  const baseStyles = clsx(styles.fileCard),
    cardStyle = clsx(baseStyles, styles[status]);

  return (
    <div className={cardStyle} ref={fileCardRef} data-status={status} id={id || uniqueId} {...props}>
      <div className={styles.cardInfoContainer}>
        <span className={styles.fileTypeIcon}>
          {getFileTypeIcon(fileName, fileType, { className: styles.fileTypeIcon })}
        </span>
        <div className={styles.fileTitle}>{fileName}</div>
        <div className={styles.fileMetaData}>{metaData}</div>
        <div className={styles.fileSize}>{getFileSize(fileSize)}</div>
        <div className={styles.statusIconContainer}>
          <div className={styles.fileStatusIcon}>{getFileStatusIcon(status)}</div>
          {hasMenuActions && (
            <Dropdown>
              <DropdownTrigger automation-id="dropdown-trigger">
                <IconButton variant="secondary" size="small" fill="none">
                  <Icon icon="mdi:dots-vertical" width="20px" color="var(--theme-icon-base)" />
                </IconButton>
              </DropdownTrigger>
              <DropdownMenu>
                {onEdit && (
                  <DropdownItem
                    onClick={onEdit}
                    icon={<Icon icon="mdi:pencil" width="20px" color="var(--theme-icon-base)" />}
                  >
                    Edit
                  </DropdownItem>
                )}
                {onDelete && (
                  <DropdownItem
                    onClick={onDelete}
                    icon={<Icon icon="mdi:delete" width="20px" color="var(--theme-icon-base)" />}
                  >
                    Delete
                  </DropdownItem>
                )}
                {onDownload && (
                  <DropdownItem
                    onClick={onDownload}
                    icon={<Icon icon="mdi:download" width="20px" color="var(--theme-icon-base)" />}
                  >
                    Download
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
      {status === FileStatus.Uploading && (
        <ProgressBar variant="primary" size="sm" value={progress} max={100} showProgress={true} />
      )}
      {showMessage && <div className={messageClass}>{message}</div>}
    </div>
  );
};

export default FileCard;
