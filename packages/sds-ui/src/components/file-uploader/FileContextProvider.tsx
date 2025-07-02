import React, { useCallback, useState } from 'react';
import { FileStatus, FileWithStatus, StatusMessageType } from '../../global-types/file-status';
import FileContext from './FileContext';

interface FileContextProviderProps {
  children: React.ReactNode;
}

const FileContextProvider: React.FC<FileContextProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [filesSelectedToUpload, setFilesSelectedToUpload] = useState<File[]>([]);
  const [filesToBeUploadedCount, setFilesToBeUploadedCount] = useState<number>(0);
  const [uploadedFileMetadata, setUploadedFileMetadata] = useState<FileWithStatus[]>([]);
  const [statusMessage, setStatusMessage] = useState<StatusMessageType | null>(null);

  const addFile = useCallback((file: File) => {
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
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setFilesToBeUploadedCount((prevCount) => prevCount + 1);
  }, []);

  const markFileAsUploaded = useCallback((file: File) => {
    setUploadedFileMetadata((prevMetadata) => [
      ...prevMetadata,
      {
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
      },
    ]);
  }, []);

  const addFilesSelectedToUpload = useCallback((files: FileList) => {
    setFilesSelectedToUpload(Array.from(files));
  }, []);

  const clearFilesSelectedToUpload = useCallback(() => {
    setFilesSelectedToUpload([]);
  }, []);

  const retryUpload = useCallback((file: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file.name === file.name ? { ...f, status: FileStatus.Uploading, progress: 0 } : f)),
    );
  }, []);

  const showStatusMessage = useCallback((type: 'success' | 'error', message: string, icon: string) => {
    setStatusMessage({ type, message, icon });
  }, []);

  const clearStatusMessage = useCallback(() => {
    setStatusMessage(null);
  }, []);

  const updateFileStatus = useCallback((fileName: string, status: FileStatus, message: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file.file.name === fileName ? { ...file, status, message } : file)),
    );
  }, []);

  const updateFileProgress = useCallback((fileName: string, progress: number) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.file.name === fileName ? { ...file, progress } : file)));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const clearUploadedFileMetadata = useCallback(() => {
    setUploadedFileMetadata([]);
  }, []);

  const deleteFile = useCallback((fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.file.name !== fileName));
    setUploadedFileMetadata((prevMetadata) => prevMetadata.filter((meta) => meta.file.name !== fileName));
  }, []);

  const onUploadCompleted = useCallback(
    (file: File) => {
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.file.name === file.name ? { ...f, status: FileStatus.Complete } : f)),
      );
      markFileAsUploaded(file);
    },
    [markFileAsUploaded],
  );

  const isDuplicateFile = useCallback(
    (file: File) => {
      return uploadedFileMetadata.some((meta) => file.name === meta.file.name && file.size === meta.size);
    },
    [uploadedFileMetadata],
  );

  const setSelectedFilesCount = useCallback((count: number) => {
    setFilesToBeUploadedCount(count);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      files,
      filesSelectedToUpload,
      addFile,
      filesToBeUploadedCount,
      setSelectedFilesCount,
      retryUpload,
      updateFileStatus,
      updateFileProgress,
      statusMessage,
      showStatusMessage,
      clearStatusMessage,
      clearAllFiles,
      deleteFile,
      onUploadCompleted,
      isDuplicateFile,
      addFilesSelectedToUpload,
      clearFilesSelectedToUpload,
      clearUploadedFileMetadata,
      markFileAsUploaded,
    }),
    [
      files,
      filesSelectedToUpload,
      addFile,
      filesToBeUploadedCount,
      setSelectedFilesCount,
      retryUpload,
      updateFileStatus,
      updateFileProgress,
      statusMessage,
      showStatusMessage,
      clearStatusMessage,
      clearAllFiles,
      deleteFile,
      onUploadCompleted,
      isDuplicateFile,
      addFilesSelectedToUpload,
      clearFilesSelectedToUpload,
      clearUploadedFileMetadata,
      markFileAsUploaded,
    ],
  );

  return <FileContext.Provider value={contextValue}>{children}</FileContext.Provider>;
};

export default FileContextProvider;
