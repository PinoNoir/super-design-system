import { clsx } from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { FileStatus, FileValidationErrorType, FileWithStatus } from '../../global-types/file-status';
import { useFileValidation } from '../../hooks';
import { Button } from '../button';
import styles from './styles/FileUploader.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadConfig, UploadResult } from './types';

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
   * Upload configuration for API integration
   */
  uploadConfig?: UploadConfig;

  /**
   * Enhanced callback function for handling file upload requests
   * Returns a Promise for better API integration
   */
  onUpload: (file: File, config?: UploadConfig) => Promise<UploadResult> | void;

  /**
   * Callback function for when a file is successfully uploaded
   */
  onUploadSuccess?: (file: File, result: UploadResult) => void;

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

  /**
   * Controlled files state - when provided, component works in controlled mode
   */
  files?: FileWithStatus[];

  /**
   * Callback for controlled files state changes
   */
  onFilesChange?: (files: FileWithStatus[]) => void;
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
  uploadConfig,
  onUpload,
  onUploadSuccess,
  onUploadFailure,
  onFileValidationFailure,
  onSelectedFileAlreadyUploaded,
  onUploadCompleted,
  maxFileSize,
  maxFiles,
  renderFileCard,
  allowDuplicates = false,
  files: controlledFiles,
  onFilesChange,
  ...props
}) => {
  // Self-contained state management
  const [internalFiles, setInternalFiles] = useState<FileWithStatus[]>([]);
  const [uploadedFileMetadata, setUploadedFileMetadata] = useState<FileWithStatus[]>([]);

  // Use controlled files if provided, otherwise use internal state
  const files = controlledFiles ?? internalFiles;

  const isDuplicateFile = useCallback(
    (file: File) => {
      return uploadedFileMetadata.some((meta) => file.name === meta.file.name && file.size === meta.size);
    },
    [uploadedFileMetadata],
  );

  const updateFiles = useCallback(
    (updater: (prev: FileWithStatus[]) => FileWithStatus[]) => {
      if (controlledFiles && onFilesChange) {
        onFilesChange(updater(controlledFiles));
      } else {
        setInternalFiles(updater);
      }
    },
    [controlledFiles, onFilesChange],
  );

  const addFile = useCallback(
    (file: File) => {
      const newFile: FileWithStatus = {
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
        file,
        status: FileStatus.Uploading,
        progress: 0,
        size: file.size,
      };

      updateFiles((prev) => [...prev, newFile]);
    },
    [updateFiles],
  );

  const updateFileStatus = useCallback(
    (fileName: string, status: FileStatus, message?: string) => {
      updateFiles((prev) => prev.map((file) => (file.file.name === fileName ? { ...file, status, message } : file)));
    },
    [updateFiles],
  );

  const markFileAsUploaded = useCallback((file: File) => {
    const uploadedFile: FileWithStatus = {
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      },
      file,
      status: FileStatus.Complete,
      progress: 100,
      size: file.size,
    };
    setUploadedFileMetadata((prev) => [...prev, uploadedFile]);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const showStatusMessage = useCallback(() => {
    // In standalone mode, status messages could be handled via callbacks
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
    async (fileList: FileList) => {
      if (!fileList || fileList.length === 0) return;

      if (!validateFileList(fileList)) return;
      const uploadedFiles: File[] = [];

      for (const file of Array.from(fileList)) {
        const isValid = validateFile(file);
        if (isValid) {
          uploadedFiles.push(file);
          addFile(file);

          try {
            const uploadResult = await Promise.resolve(onUpload(file, uploadConfig));

            // Handle both new Promise-based and legacy void returns
            if (uploadResult && typeof uploadResult === 'object' && 'success' in uploadResult) {
              if (uploadResult.success) {
                updateFileStatus(file.name, FileStatus.Complete, 'Upload successful');
                markFileAsUploaded(file);
                onUploadSuccess?.(file, uploadResult);
              } else {
                updateFileStatus(file.name, FileStatus.ValidationFailed, uploadResult.error || 'Upload failed');
                onUploadFailure?.(file, uploadResult.error);
              }
            }
          } catch (error) {
            updateFileStatus(file.name, FileStatus.ValidationFailed, 'Upload failed');
            onUploadFailure?.(file, error);
            showStatusMessage();
          }
        }
      }

      onUploadCompleted?.(uploadedFiles);
    },
    [
      validateFile,
      validateFileList,
      addFile,
      onUpload,
      uploadConfig,
      updateFileStatus,
      markFileAsUploaded,
      onUploadSuccess,
      onUploadFailure,
      showStatusMessage,
      onUploadCompleted,
    ],
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
          {files.map((fileWithStatus: FileWithStatus) => (
            <motion.div
              key={fileWithStatus.file?.name || fileWithStatus.fileInfo?.name}
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
