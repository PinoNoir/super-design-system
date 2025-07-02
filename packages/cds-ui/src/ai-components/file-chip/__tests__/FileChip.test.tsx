import { render, screen, fireEvent } from '@testing-library/react';
import FileChip from '../FileChip';

const mockFile = new File(['hello'], 'test.txt', { type: 'text/plain' });

describe('FileChip Component', () => {
  it('renders file name and size', () => {
    render(<FileChip file={mockFile} />);
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('5 B')).toBeInTheDocument();
  });

  it('shows loader when isLoading is true', () => {
    render(<FileChip file={mockFile} isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // Assuming Loader has role="progressbar"
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<FileChip file={mockFile} onRemove={onRemove} />);
    const removeButton = screen.getByLabelText('Remove file');
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onRetry when retry button is clicked and status is error', () => {
    const onRetry = jest.fn();
    render(<FileChip file={mockFile} onRetry={onRetry} status="error" />);
    const retryButton = screen.getByLabelText('Retry upload');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders children if provided', () => {
    render(
      <FileChip file={mockFile}>
        <span>Extra Info</span>
      </FileChip>,
    );
    expect(screen.getByText('Extra Info')).toBeInTheDocument();
  });
});
