export enum FileStatus {
  Uploading = 'uploading',
  Complete = 'complete',
  Failed = 'failed',
  Downloading = 'downloading',
  Deleted = 'deleted',
  ValidationFailed = 'validationFailed',
}

export type StatusMessageType = {
  type: 'error' | 'success';
  message: string;
  icon: string;
};

export enum FileValidationErrorType {
  FileSizeExceeded,
  FileTypeNotAccepted,
  MaxNumberOfFilesExceeded,
  FileAlreadyUploaded,
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  source?: 'local' | 'remote' | 'generated';
  url?: string;
  originalFile?: File | Blob; // Original browser File object if available
  [key: string]: any; // For additional custom properties
}

export interface FileWithStatus {
  fileInfo: FileInfo;
  file?: File;
  id?: string;
  status: FileStatus;
  progress: number;
  message?: string;
  error?: Error | string;
  [key: string]: any;
}
