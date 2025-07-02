// useFileValidation.ts
import { useCallback } from 'react';
import { FileValidationErrorType } from '../global-types/file-status';
import { isFileTypeAccepted } from '../global-types/file-types';

interface UseFileValidationProps {
  maxFileSize: number;
  accept?: string[];
  maxFiles: number;
  allowDuplicates?: boolean;
  applyCustomFileListValidation?: (files: File[]) => boolean;
  onFileValidationFailure?: (errorType: FileValidationErrorType, fileName: string) => void;
  onSelectedFileAlreadyUploaded?: (fileName: string) => void;
  isDuplicateFile: (file: File) => boolean;
  showStatusMessage: (type: 'error' | 'success', message: string, icon: string) => void;
}

const useFileValidation = ({
  maxFileSize,
  accept,
  maxFiles,
  allowDuplicates,
  applyCustomFileListValidation,
  onFileValidationFailure,
  onSelectedFileAlreadyUploaded,
  isDuplicateFile,
  showStatusMessage,
}: UseFileValidationProps) => {
  const validateFile = useCallback(
    (file: File): boolean => {
      const isFileSizeValid = (fileSize: number) => fileSize <= maxFileSize * 1024 * 1024;

      if (!isFileSizeValid(file.size)) {
        onFileValidationFailure?.(FileValidationErrorType.FileSizeExceeded, file.name);
        showStatusMessage(
          'error',
          `File ${file.name} exceeds the maximum file size of ${maxFileSize}MB.`,
          'alert-rhombus',
        );
        return false;
      }

      if (!isFileTypeAccepted(file, accept)) {
        onFileValidationFailure?.(FileValidationErrorType.FileTypeNotAccepted, file.name);
        showStatusMessage(
          'error',
          `This file type is not accepted. Please upload a file with the following extensions: ${accept?.join(', ')}.`,
          'alert-rhombus',
        );
        return false;
      }

      if (!allowDuplicates) {
        if (isDuplicateFile(file)) {
          onFileValidationFailure?.(FileValidationErrorType.FileAlreadyUploaded, file.name);
          onSelectedFileAlreadyUploaded?.(file.name);
          showStatusMessage('error', `File ${file.name} has already been uploaded.`, 'alert-rhombus');
          return false;
        }
      }
      // If all validations pass
      return true;
    },
    [
      accept,
      isDuplicateFile,
      maxFileSize,
      allowDuplicates,
      onFileValidationFailure,
      showStatusMessage,
      onSelectedFileAlreadyUploaded,
    ],
  );

  const validateFileList = useCallback(
    (fileList: FileList): boolean => {
      const filesArray = Array.from(fileList);
      if (fileList.length > maxFiles) {
        const message = `You can only upload up to ${maxFiles} files at a time.`;
        const fileNames = filesArray.map((file: File) => file.name);
        onFileValidationFailure?.(FileValidationErrorType.MaxNumberOfFilesExceeded, fileNames.join(', '));
        showStatusMessage('error', message, 'alert-rhombus');
        return false;
      }
      if (!allowDuplicates) {
        if (filesArray.some((file: File) => isDuplicateFile(file))) {
          const message =
            fileList.length > 1
              ? 'One of the selected files has already been uploaded. Please select other file.'
              : `This file has already been uploaded. Please select other file.`;
          const fileNames = filesArray.map((file: File) => file.name);
          onFileValidationFailure?.(FileValidationErrorType.FileAlreadyUploaded, fileNames.join(', '));
          showStatusMessage('error', message, 'alert-rhombus');
          return false;
        }
      }
      if (applyCustomFileListValidation) {
        return applyCustomFileListValidation(filesArray);
      }

      return true;
    },
    [
      isDuplicateFile,
      maxFiles,
      allowDuplicates,
      onFileValidationFailure,
      showStatusMessage,
      applyCustomFileListValidation,
    ],
  );

  return { validateFile, validateFileList };
};

export default useFileValidation;
