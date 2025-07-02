import { createContext } from 'react';
import { FileStatus, FileWithStatus, StatusMessageType } from '../../global-types/file-status';

export interface FileContextType {
  files: FileWithStatus[];
  filesToBeUploadedCount: number;
  setSelectedFilesCount: (count: number) => void;
  statusMessage?: StatusMessageType;
  showStatusMessage: (type: 'success' | 'error', message: string, icon: string) => void;
  clearStatusMessage: () => void;
  addFile: (file: File) => void;
  retryUpload: (file: File) => void;
  updateFileStatus: (fileName: string, status: FileStatus, message?: string) => void;
  updateFileProgress: (fileName: string, progress: number) => void;
  onUploadCompleted: (file: File) => void;
  clearAllFiles: () => void;
  deleteFile: (fileName: string) => void;
  isDuplicateFile: (file: File) => boolean;
  filesSelectedToUpload: File[];
  addFilesSelectedToUpload: (files: FileList) => void;
  clearFilesSelectedToUpload: () => void;
  clearUploadedFileMetadata: () => void;
  markFileAsUploaded: (file: File) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export default FileContext;
