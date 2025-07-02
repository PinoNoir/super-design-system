import { renderHook } from '@testing-library/react';
import useFileValidation from '../useFileValidation';
import { FileValidationErrorType } from '../../global-types/file-status';

describe('useFileValidation', () => {
  const mockProps = {
    maxFileSize: 5, // 5MB
    accept: ['.pdf', '.doc'],
    maxFiles: 3,
    allowDuplicates: false,
    isDuplicateFile: jest.fn(),
    showStatusMessage: jest.fn(),
    onFileValidationFailure: jest.fn(),
    onSelectedFileAlreadyUploaded: jest.fn(),
  };

  // Mock File implementation with size property
  class MockFile extends File {
    constructor(name: string, sizeInMB: number, type: string) {
      super([], name, { type });
      Object.defineProperty(this, 'size', {
        get() {
          return sizeInMB * 1024 * 1024;
        },
      });
    }
  }

  const createMockFile = (name: string, sizeInMB: number, type: string): File => {
    return new MockFile(name, sizeInMB, type);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateFile', () => {
    it('should validate file size', () => {
      const { result } = renderHook(() => useFileValidation(mockProps));
      const file = createMockFile('test.pdf', 6, 'application/pdf'); // 6MB file

      const isValid = result.current.validateFile(file);

      expect(isValid).toBe(false);
      expect(mockProps.onFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.FileSizeExceeded,
        'test.pdf',
      );
      expect(mockProps.showStatusMessage).toHaveBeenCalledWith(
        'error',
        'File test.pdf exceeds the maximum file size of 5MB.',
        'alert-rhombus',
      );
    });

    it('should validate file type', () => {
      const { result } = renderHook(() => useFileValidation(mockProps));
      const file = createMockFile('test.txt', 1, 'text/plain');

      const isValid = result.current.validateFile(file);

      expect(isValid).toBe(false);
      expect(mockProps.onFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.FileTypeNotAccepted,
        'test.txt',
      );
    });

    it('should check for duplicates', () => {
      mockProps.isDuplicateFile.mockReturnValue(true);
      const { result } = renderHook(() => useFileValidation(mockProps));
      const file = createMockFile('test.pdf', 1, 'application/pdf');

      const isValid = result.current.validateFile(file);

      expect(isValid).toBe(false);
      expect(mockProps.onFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.FileAlreadyUploaded,
        'test.pdf',
      );
      expect(mockProps.onSelectedFileAlreadyUploaded).toHaveBeenCalledWith('test.pdf');
    });

    it('should allow valid files', () => {
      mockProps.isDuplicateFile.mockReturnValue(false);
      const { result } = renderHook(() => useFileValidation(mockProps));
      const file = createMockFile('test.pdf', 1, 'application/pdf');

      const isValid = result.current.validateFile(file);

      expect(isValid).toBe(true);
      expect(mockProps.onFileValidationFailure).not.toHaveBeenCalled();
    });
  });

  describe('validateFileList', () => {
    it('should validate number of files', () => {
      const { result } = renderHook(() => useFileValidation(mockProps));
      const files = [
        createMockFile('1.pdf', 1, 'application/pdf'),
        createMockFile('2.pdf', 1, 'application/pdf'),
        createMockFile('3.pdf', 1, 'application/pdf'),
        createMockFile('4.pdf', 1, 'application/pdf'),
      ];
      const fileList = {
        length: files.length,
        item: (i: number) => files[i],
        [Symbol.iterator]: function* () {
          yield* files;
        },
      } as FileList;

      const isValid = result.current.validateFileList(fileList);

      expect(isValid).toBe(false);
      expect(mockProps.onFileValidationFailure).toHaveBeenCalledWith(
        FileValidationErrorType.MaxNumberOfFilesExceeded,
        '1.pdf, 2.pdf, 3.pdf, 4.pdf',
      );
    });

    it('should validate custom file list validation', () => {
      const customValidation = jest.fn().mockReturnValue(false);
      const props = { ...mockProps, applyCustomFileListValidation: customValidation };
      const { result } = renderHook(() => useFileValidation(props));
      const files = [createMockFile('test.pdf', 1, 'application/pdf')];
      const fileList = {
        length: files.length,
        item: (i: number) => files[i],
        [Symbol.iterator]: function* () {
          yield* files;
        },
      } as FileList;

      const isValid = result.current.validateFileList(fileList);

      expect(isValid).toBe(false);
      expect(customValidation).toHaveBeenCalled();
    });
  });
});
