import { clsx } from 'clsx';
import React, { useCallback, useRef } from 'react';
import { FileStatus, FileValidationErrorType, FileWithStatus } from '../../global-types/file-status';
import useFileContext from './useFileContext';
import { useFileValidation } from '../../hooks';
import { Button } from '../button';
import styles from './styles/FileUploader.module.css';
import { AnimatePresence, motion } from 'framer-motion';

export interface FileUploaderProps {
  /**
   * Specify the id of the `<FileUploader>` component
   */
  id?: string;

  /**
   * Specify any content to be rendered in the `<FileUploader>`
   * For example, this can be used to render `<FileCard>` components
   */
  children?: React.ReactNode;

  /**
   * Label for the `<FileUploader>` button
   */
  buttonLabel: string;

  /**
   * Icon for the `<FileUploader>` button
   */
  buttonIcon?: React.ReactElement;

  /**
   * Specify the description text of the `<FileUploader>`
   */
  labelDescription?: string;

  /**
   * Specify the helper text for the `<FileUploader>`
   */
  helperText: string;

  /**
   * Allow multiple files to be uploaded
   * @default true
   */
  multiple?: boolean;

  /**
   * Specify the types of files that this input should be able to receive
   */
  accept?: string[];

  /**
   * Specify whether the `<FileUploader>` button is disabled
   */
  disabled?: boolean;

  /**
   * Specify the maximum file size allowed
   */
  maxFileSize?: number;

  /**
   * Specify the maximum number of files allowed
   */
  maxFiles?: number;

  /**
   * Allow duplicate files to be uploaded (does not trigger dupe check validation if true)
   * @default false
   */
  allowDuplicates?: boolean;

  /**
   * Callback function for invoking additional custom files validation(s)
   */
  onCustomFilesValidate?: (files: File[]) => boolean;

  /**
   * Callback function for handling file upload requests
   */
  onUpload: (file: File) => void;

  /**
   * Callback function for when a file is successfully uploaded
   */
  onUploadSuccess?: (file: File, status: FileStatus) => void;

  /**
   * Callback function for when a file upload fails
   */
  onUploadFailure?: (file: File, error: any) => void;

  /**
   * Callback function for when a file fails validation
   */
  onFileValidationFailure?: (errorType: FileValidationErrorType, fileName: string) => void;

  /**
   * Callback function for when a file is selected and it has already been uploaded
   */
  onSelectedFileAlreadyUploaded?: (fileName: string) => void;

  /**
   * Callback function for when all files have been uploaded
   */
  onUploadCompleted?: (files: File[]) => void;

  /**
   * Callback function to retry uploading a file that has failed
   */
  onRetryUpload?: (file: File) => void;

  /**
   * Custom render function for the file card component to display onUpload
   */
  renderFileCard?: (file: FileWithStatus) => React.ReactNode;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  children,
  buttonLabel,
  buttonIcon,
  helperText,
  multiple = true,
  accept,
  labelDescription,
  disabled,
  onCustomFilesValidate,
  onUpload,
  onFileValidationFailure,
  onSelectedFileAlreadyUploaded,
  onUploadCompleted,
  maxFileSize,
  maxFiles,
  renderFileCard,
  allowDuplicates = false,
  ...props
}) => {
  const { files, isDuplicateFile, showStatusMessage, addFilesSelectedToUpload } = useFileContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const { validateFile, validateFileList } = useFileValidation({
    maxFileSize,
    accept,
    maxFiles,
    allowDuplicates,
    applyCustomFileListValidation: onCustomFilesValidate,
    onFileValidationFailure,
    onSelectedFileAlreadyUploaded,
    isDuplicateFile,
    showStatusMessage,
  });

  const handleFileSelection = useCallback(
    (fileList: FileList) => {
      if (!fileList || fileList.length === 0) return;

      if (!validateFileList(fileList)) return;
      const uploadedFiles: File[] = [];

      Array.from(fileList).forEach((file) => {
        const isValid = validateFile(file);
        if (isValid) {
          uploadedFiles.push(file);
          onUpload(file);
        }
      });

      addFilesSelectedToUpload(fileList);
      onUploadCompleted?.(uploadedFiles);
    },
    [validateFile, validateFileList, addFilesSelectedToUpload, onUpload, onUploadCompleted],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList) {
        handleFileSelection(fileList);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelection],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const fileList = event.dataTransfer.files;
      handleFileSelection(fileList);
    },
    [handleFileSelection],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  /**
   * The File Uploader allows users to upload several
   * different file types/documents to a database from their computer's file system.
   */
  return (
    <div className={styles.fileUploader} {...props}>
      <div
        role="button"
        aria-label="Drag and drop files here to upload"
        automation-id="file-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={clsx(styles.fileDropContainer, { [styles.disabled]: disabled })}
        aria-disabled={disabled}
        draggable={true}
        onDragStart={(event) => event.preventDefault()}
        onDragLeave={(event) => event.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            openFileDialog();
          }
        }}
      >
        <Button
          variant="primary"
          aria-label="Select files to upload"
          disabled={disabled}
          onClick={openFileDialog}
          style={{ marginRight: '8px' }}
          iconPosition="left"
          icon={buttonIcon}
        >
          {buttonLabel}
        </Button>
        {labelDescription}
      </div>
      <input
        id={id}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept?.join(',')}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-label="Upload files"
        automation-id="file-uploader"
      />
      <p className={styles.fileDescription}>{helperText}</p>
      <div className={styles.fileContainer}>
        <AnimatePresence>
          {files.map((fileWithStatus) => (
            <motion.div
              key={fileWithStatus.file.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
              exit={{ y: 0, opacity: 0, transition: { duration: 0.1, ease: 'easeOut' } }}
            >
              {renderFileCard ? renderFileCard(fileWithStatus) : null}
            </motion.div>
          ))}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
};

export default FileUploader;
