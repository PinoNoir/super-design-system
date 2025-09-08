import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FileUploader, FileContextProvider } from '..';
import { FileValidationErrorType } from '../../../global-types/file-status';

const renderFileUploaderWithContext = (props = {}) => {
  return render(
    <FileContextProvider>
      <FileUploader buttonLabel="Upload" helperText="Test helper text" onUpload={jest.fn()} {...props} />
    </FileContextProvider>,
  );
};

const createFile = (name, size, type) => {
  const file = new File([''.padStart(size, 'a')], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUploader component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful file upload', async () => {
    const mockOnUpload = jest.fn();

    renderFileUploaderWithContext({
      accept: ['.pdf', 'application/pdf'],
      onUpload: mockOnUpload,
    });

    const input = screen.getByTestId('file-uploader');
    const file = createFile('document.pdf', 1024 * 1024, 'application/pdf');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled;
    });
  });

  test('accepts only PDF files for upload', async () => {
    const mockOnUpload = jest.fn();
    const mockOnFileValidationFailure = jest.fn();

    renderFileUploaderWithContext({
      accept: ['.pdf', 'application/pdf'],
      maxFiles: 1,
      maxFileSize: 5,
      onUpload: mockOnUpload,
      onFileValidationFailure: mockOnFileValidationFailure,
    });

    const input = screen.getByTestId('file-uploader');
    const pdfFile = createFile('document.pdf', 1024 * 1024, 'application/pdf');
    const jpgFile = createFile('image.jpg', 1024 * 1024, 'image/jpeg');

    fireEvent.change(input, { target: { files: [pdfFile] } });
    await waitFor(() =>
      expect(mockOnUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'document.pdf',
          size: 1024 * 1024,
          type: 'application/pdf',
        }),
        undefined, // uploadConfig parameter
      ),
    );

    fireEvent.change(input, { target: { files: [jpgFile] } });
    await waitFor(() =>
      expect(mockOnFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.FileTypeNotAccepted,
        'image.jpg',
      ),
    );
  });

  test('displays an error for files larger than max size', async () => {
    const mockOnFileValidationFailure = jest.fn();

    renderFileUploaderWithContext({
      maxFiles: 1,
      maxFileSize: 1,
      onFileValidationFailure: mockOnFileValidationFailure,
    });

    const input = screen.getByTestId('file-uploader');
    const largeFile = createFile('large-document.pdf', 2 * 1024 * 1024, 'application/pdf');

    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() =>
      expect(mockOnFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.FileSizeExceeded,
        'large-document.pdf',
      ),
    );
  });

  test('handles multiple file uploads', async () => {
    const mockOnUpload = jest.fn();

    renderFileUploaderWithContext({
      accept: ['.pdf', 'application/pdf'],
      multiple: true,
      maxFiles: 3,
      onUpload: mockOnUpload,
    });

    const input = screen.getByTestId('file-uploader');
    const file1 = createFile('file1.pdf', 1024 * 1024, 'application/pdf');
    const file2 = createFile('file2.pdf', 1024 * 1024, 'application/pdf');
    const file3 = createFile('file3.pdf', 1024 * 1024, 'application/pdf');

    fireEvent.change(input, { target: { files: [file1, file2, file3] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled;
    });
  });

  test('displays an error when too many files are uploaded', async () => {
    const mockOnFileValidationFailure = jest.fn();

    renderFileUploaderWithContext({
      maxFiles: 2,
      onFileValidationFailure: mockOnFileValidationFailure,
    });

    const input = screen.getByTestId('file-uploader');
    const file1 = createFile('file1.pdf', 1024 * 1024, 'application/pdf');
    const file2 = createFile('file2.pdf', 1024 * 1024, 'application/pdf');
    const file3 = createFile('file3.pdf', 1024 * 1024, 'application/pdf');

    fireEvent.change(input, { target: { files: [file1, file2, file3] } });

    await waitFor(() =>
      expect(mockOnFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.MaxNumberOfFilesExceeded,
        'file1.pdf, file2.pdf, file3.pdf',
      ),
    );
  });
});
