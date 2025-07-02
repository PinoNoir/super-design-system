import { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback } from 'react';
import { FileStatus, FileValidationErrorType, FileWithStatus } from '../../global-types/file-status';
import FileContextProvider from './FileContextProvider';
import useFileContext from './useFileContext';
import FileUploader from './FileUploader';
import FileCard from './FileCard';
import StatusMessageDisplay from './StatusMessageDisplay';
import StatusMessage from './StatusMessage';

const meta: Meta<typeof FileUploader> = {
  title: 'Components/Inputs/File Uploader',
  component: FileUploader,
  subcomponents: { FileCard, StatusMessageDisplay, StatusMessage },
  tags: ['!autodocs'],
  decorators: [
    (Story) => (
      <FileContextProvider>
        <div style={{ maxWidth: '800px' }}>
          <Story />
        </div>
      </FileContextProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileUploader>;

const FileUploadExampleComponent = () => {
  const {
    addFile,
    updateFileProgress,
    updateFileStatus,
    filesToBeUploadedCount,
    showStatusMessage,
    retryUpload,
    clearAllFiles,
    markFileAsUploaded, // New function to mark file as uploaded
  } = useFileContext();

  const mockOnUpload = useCallback(
    async (file: File) => {
      addFile(file);

      try {
        // Simulate chunking
        const chunkSize = 1024 * 1024;
        const totalChunks = Math.ceil(file.size / chunkSize);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
          updateFileProgress(file.name, progress);
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));

        updateFileStatus(file.name, FileStatus.Complete, 'File uploaded successfully.');
        markFileAsUploaded(file);
        clearAllFiles();
      } catch (error) {
        updateFileStatus(file.name, FileStatus.ValidationFailed, 'File upload failed.');
        showStatusMessage('error', 'File upload failed. Please try again.', 'alert-rhombus');
        throw error;
      }
    },
    [addFile, updateFileProgress, updateFileStatus, showStatusMessage, markFileAsUploaded],
  );

  const mockOnFileValidationFailure = (errorType: FileValidationErrorType, fileName: string) => {
    console.log(`File validation failed: ${errorType} - ${fileName}`);
  };

  const mockOnUploadCompleted = (files: File[]) => {
    files.forEach((file) => {
      console.log(`All files uploaded: ${file.name} - ${file.stream}`);
    });
  };

  const renderFileCard = useCallback(
    (fileWithStatus: FileWithStatus) => (
      <FileCard
        key={fileWithStatus.fileInfo.name} // Update from fileWithStatus.file.name
        file={fileWithStatus}
        onRetryUpload={() => retryUpload(fileWithStatus.file)}
        metaData="ECF-2019-01-01"
      />
    ),
    [retryUpload],
  );

  return (
    <>
      <div style={{ marginBlockEnd: 8 }}>Files uploaded: {filesToBeUploadedCount}</div>
      <FileUploader
        buttonLabel="Select file"
        helperText="Up to 5 files can be uploaded at a time, each no larger than 20MB, and the total upload size should not exceed 200MB. Only PDF format is accepted."
        accept={['.pdf']}
        labelDescription="or Drop Files Here"
        disabled={false}
        multiple={true}
        maxFileSize={10}
        maxFiles={5}
        onUpload={mockOnUpload}
        onFileValidationFailure={mockOnFileValidationFailure}
        onUploadCompleted={mockOnUploadCompleted}
        renderFileCard={renderFileCard}
      >
        <StatusMessageDisplay />
      </FileUploader>
    </>
  );
};

export const FileUploadExample: Story = {
  render: () => <FileUploadExampleComponent />,
};

export const FileCardExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      {/* Basic file card - no menu */}
      <FileCard
        file={{
          fileInfo: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
          status: FileStatus.Complete,
          progress: 100,
          size: 10000000,
        }}
        metaData="ECF-2019-01-01"
      />

      {/* Uploading file card */}
      <FileCard
        file={{
          fileInfo: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
          status: FileStatus.Uploading,
          progress: 73,
          size: 5000000,
        }}
        metaData="ECF-2019-01-01"
      />

      {/* Failed validation file card with retry functionality */}
      <FileCard
        file={{
          fileInfo: new File([''], 'file-name.doc', { type: 'application/msword' }),
          status: FileStatus.ValidationFailed,
          progress: 0,
          message: 'File type not supported',
          size: 1000000,
        }}
        metaData="ECF-2019-01-01"
        onRetryUpload={(file) => console.log('Retrying upload for', file.name)}
      />

      {/* Complete file card with all menu actions */}
      <FileCard
        file={{
          fileInfo: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
          status: FileStatus.Complete,
          progress: 100,
          size: 10000000,
        }}
        metaData="ECF-2019-01-01"
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onDownload={() => console.log('Download clicked')}
      />

      {/* Image file card with download only */}
      <FileCard
        file={{
          fileInfo: new File([''], 'image.png', { type: 'image/png' }),
          status: FileStatus.Complete,
          progress: 100,
          size: 3000000,
        }}
        metaData="ECF-2019-01-01"
        onDownload={() => console.log('Download clicked')}
      />
    </div>
  );
};
