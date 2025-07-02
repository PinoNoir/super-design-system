import { act, waitFor, renderHook } from '@testing-library/react';
import FileContextProvider from '../FileContextProvider';
import useFileContext from '../useFileContext';
import { FileStatus } from '../../../global-types/file-status';

const useTestFileContext = () => useFileContext();

const wrapper = ({ children }: { children: React.ReactNode }) => <FileContextProvider>{children}</FileContextProvider>;

describe('FileContext', () => {
  it('provides the correct initial state', () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    expect(result.current.files).toEqual([]);
    expect(result.current.statusMessage).toBeNull();
  });

  it('adds a file correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.addFile(new File(['test'], 'test.txt', { type: 'text/plain' }));
    });

    await waitFor(() => {
      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].file.name).toBe('test.txt');
      expect(result.current.files[0].status).toBe(FileStatus.Uploading);
    });
  });

  it('updates file status correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.addFile(new File(['test'], 'test.txt', { type: 'text/plain' }));
      result.current.updateFileStatus('test.txt', FileStatus.Complete, 'Upload complete');
    });

    await waitFor(() => {
      expect(result.current.files[0].status).toBe(FileStatus.Complete);
      expect(result.current.files[0].message).toBe('Upload complete');
    });
  });

  it('updates file progress correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.addFile(new File(['test'], 'test.txt', { type: 'text/plain' }));
      result.current.updateFileProgress('test.txt', 50);
    });

    await waitFor(() => {
      expect(result.current.files[0].progress).toBe(50);
    });
  });

  it('shows and clears status message correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.showStatusMessage('success', 'Upload successful', 'check-circle');
    });

    await waitFor(() => {
      expect(result.current.statusMessage).toEqual({
        type: 'success',
        message: 'Upload successful',
        icon: 'check-circle',
      });
    });

    act(() => {
      result.current.clearStatusMessage();
    });

    await waitFor(() => {
      expect(result.current.statusMessage).toBeNull();
    });
  });

  it('deletes a file correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.addFile(new File(['test'], 'test.txt', { type: 'text/plain' }));
      result.current.deleteFile('test.txt');
    });

    await waitFor(() => {
      expect(result.current.files).toHaveLength(0);
    });
  });

  it('clears all files correctly', async () => {
    const { result } = renderHook(() => useTestFileContext(), { wrapper });

    act(() => {
      result.current.addFile(new File(['test'], 'test.txt', { type: 'text/plain' }));
      result.current.clearAllFiles();
    });

    await waitFor(() => {
      expect(result.current.files).toHaveLength(0);
    });
  });
});
