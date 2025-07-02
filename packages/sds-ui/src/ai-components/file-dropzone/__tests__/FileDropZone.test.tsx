import { render, fireEvent, screen } from '@testing-library/react';
import FileDropZone from '../FileDropZone';

describe('FileDropZone', () => {
  const mockOnFilesSelected = jest.fn();

  beforeEach(() => {
    mockOnFilesSelected.mockClear();
  });

  it('renders the drop zone with default text', () => {
    render(<FileDropZone onFilesSelected={mockOnFilesSelected} />);
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
  });

  it('calls onFilesSelected when files are dropped', () => {
    render(<FileDropZone onFilesSelected={mockOnFilesSelected} />);
    const dropZone = screen.getByText(/drag & drop files here/i).parentElement!;

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const data = {
      dataTransfer: {
        files: [file],
        items: [],
        types: ['Files'],
      },
    };

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, data);

    expect(mockOnFilesSelected).toHaveBeenCalled();
    expect(mockOnFilesSelected.mock.calls[0][0][0].name).toBe('hello.txt');
  });

  it('calls onFilesSelected when files are selected via input', () => {
    const { container } = render(<FileDropZone onFilesSelected={mockOnFilesSelected} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['world'], 'world.txt', { type: 'text/plain' });
    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(mockOnFilesSelected).toHaveBeenCalled();
    expect(mockOnFilesSelected.mock.calls[0][0][0].name).toBe('world.txt');
  });

  it('adds dragging class on drag over and removes on drag leave', () => {
    const { container } = render(<FileDropZone onFilesSelected={mockOnFilesSelected} />);
    const dropZone = container.querySelector('div')!;

    fireEvent.dragOver(dropZone);
    expect(dropZone.className).toMatch(/dragging/);

    fireEvent.dragLeave(dropZone);
    expect(dropZone.className).not.toMatch(/dragging/);
  });
});
