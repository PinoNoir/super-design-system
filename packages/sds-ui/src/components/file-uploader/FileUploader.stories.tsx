import { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { FileStatus, FileValidationErrorType, FileWithStatus } from '../../global-types/file-status';
import FileUploader from './FileUploader';
import FileCard from './FileCard';
import StatusMessageDisplay from './StatusMessageDisplay';
import StatusMessage from './StatusMessage';
import { UploadResult, UploadConfig } from './types';
import { FileUploaderAdapters } from './uploadAdapters';

const meta: Meta<typeof FileUploader> = {
  title: 'Components/Inputs/File Uploader',
  component: FileUploader,
  subcomponents: { FileCard, StatusMessageDisplay, StatusMessage },
  tags: ['!autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileUploader>;

const FileUploadExampleComponent = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [filesToBeUploadedCount, setFilesToBeUploadedCount] = useState(0);

  const mockOnUpload = useCallback(async (file: File): Promise<UploadResult> => {
    try {
      // Simulate chunking
      const chunkSize = 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFilesToBeUploadedCount((prev) => prev + 1);

      return {
        success: true,
        progress: 100,
        data: { id: Math.random().toString(36) },
        file,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        file,
      };
    }
  }, []);

  const mockOnFileValidationFailure = (errorType: FileValidationErrorType, fileName: string) => {
    console.log(`File validation failed: ${errorType} - ${fileName}`);
  };

  const mockOnUploadCompleted = (files: File[]) => {
    files.forEach((file) => {
      console.log(`All files uploaded: ${file.name}`);
    });
  };

  const renderFileCard = useCallback(
    (fileWithStatus: FileWithStatus) => (
      <FileCard
        key={fileWithStatus.fileInfo?.name || fileWithStatus.file?.name}
        file={fileWithStatus}
        metaData="ECF-2019-01-01"
      />
    ),
    [],
  );

  return (
    <>
      <div style={{ marginBlockEnd: 8 }}>Files uploaded: {filesToBeUploadedCount}</div>
      <FileUploader
        files={files}
        onFilesChange={setFiles}
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

// New standalone mode example
const StandaloneFileUploader = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);

  const handleUpload = useCallback(async (file: File, _config?: UploadConfig): Promise<UploadResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          progress: 100,
          data: { id: Math.random().toString(36), url: `https://example.com/files/${file.name}` },
          file,
        });
      }, 2000);
    });
  }, []);

  const renderFileCard = useCallback(
    (fileWithStatus: FileWithStatus) => (
      <FileCard
        key={fileWithStatus.fileInfo?.name || fileWithStatus.file?.name}
        file={fileWithStatus}
        metaData="Standalone Upload"
      />
    ),
    [],
  );

  return (
    <FileUploader
      files={files}
      onFilesChange={setFiles}
      buttonLabel="Select Files"
      helperText="No context provider required!"
      accept={['.pdf', '.jpg', '.png']}
      multiple={true}
      maxFileSize={10}
      maxFiles={5}
      onUpload={handleUpload}
      renderFileCard={renderFileCard}
    />
  );
};

export const StandaloneMode: Story = {
  render: () => <StandaloneFileUploader />,
};

// REST API example
const RestApiFileUploader = () => {
  const uploadAdapter = FileUploaderAdapters.createRestUploader({
    baseUrl: 'https://api.example.com',
    endpoint: 'upload',
    headers: { Authorization: 'Bearer token123' },
  });

  const renderFileCard = useCallback(
    (fileWithStatus: FileWithStatus) => (
      <FileCard
        key={fileWithStatus.fileInfo?.name || fileWithStatus.file?.name}
        file={fileWithStatus}
        metaData="REST API"
      />
    ),
    [],
  );

  return (
    <FileUploader
      buttonLabel="Upload to API"
      helperText="Files will be uploaded to REST API endpoint"
      accept={['.pdf', '.doc', '.docx']}
      multiple={true}
      onUpload={uploadAdapter}
      renderFileCard={renderFileCard}
    />
  );
};

export const RestApiUpload: Story = {
  render: () => <RestApiFileUploader />,
};

// FormData example
const FormDataFileUploader = () => {
  const uploadAdapter = FileUploaderAdapters.createFormDataUploader({
    url: '/api/upload',
    fileKey: 'document',
    additionalFields: {
      userId: '123',
      category: 'documents',
    },
  });

  const renderFileCard = useCallback(
    (fileWithStatus: FileWithStatus) => (
      <FileCard
        key={fileWithStatus.fileInfo?.name || fileWithStatus.file?.name}
        file={fileWithStatus}
        metaData="FormData Upload"
      />
    ),
    [],
  );

  return (
    <FileUploader
      buttonLabel="Upload with FormData"
      helperText="Files uploaded using FormData with additional fields"
      onUpload={uploadAdapter}
      renderFileCard={renderFileCard}
    />
  );
};

export const FormDataUpload: Story = {
  render: () => <FormDataFileUploader />,
};

export const FileCardExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      {/* Basic file card - no menu */}
      <FileCard
        file={{
          fileInfo: {
            name: 'file-name.pdf',
            size: 10000000,
            type: 'application/pdf',
            lastModified: Date.now(),
          },
          file: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
          status: FileStatus.Complete,
          progress: 100,
          size: 10000000,
        }}
        metaData="ECF-2019-01-01"
      />

      {/* Uploading file card */}
      <FileCard
        file={{
          fileInfo: {
            name: 'file-name.pdf',
            size: 5000000,
            type: 'application/pdf',
            lastModified: Date.now(),
          },
          file: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
          status: FileStatus.Uploading,
          progress: 73,
          size: 5000000,
        }}
        metaData="ECF-2019-01-01"
      />

      {/* Failed validation file card with retry functionality */}
      <FileCard
        file={{
          fileInfo: {
            name: 'file-name.doc',
            size: 1000000,
            type: 'application/msword',
            lastModified: Date.now(),
          },
          file: new File([''], 'file-name.doc', { type: 'application/msword' }),
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
          fileInfo: {
            name: 'file-name.pdf',
            size: 10000000,
            type: 'application/pdf',
            lastModified: Date.now(),
          },
          file: new File([''], 'file-name.pdf', { type: 'application/pdf' }),
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
          fileInfo: {
            name: 'image.png',
            size: 3000000,
            type: 'image/png',
            lastModified: Date.now(),
          },
          file: new File([''], 'image.png', { type: 'image/png' }),
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
