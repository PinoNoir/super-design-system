import { Meta, StoryObj } from '@storybook/react-vite';
import FileChip from './FileChip';

const meta: Meta<typeof FileChip> = {
  title: 'AI Components/File Chip',
  component: FileChip,
};

export default meta;

type Story = StoryObj<typeof FileChip>;

const mockFile = new File(['hello'], 'example.txt', { type: 'text/plain' });

export const Default: Story = {
  args: {
    file: mockFile,
    onRemove: () => alert('Removed'),
  },
};

export const Loading: Story = {
  args: {
    file: mockFile,
    onRemove: () => alert('Removed'),
    isLoading: true,
  },
};

export const FailedUpload: Story = {
  args: {
    file: mockFile,
    onRemove: () => alert('Removed'),
    status: 'error',
    children: <div style={{ color: 'var(--theme-color-error)' }}>Upload failed</div>,
  },
};

export const SuccessfulUpload: Story = {
  args: {
    file: mockFile,
    onRemove: () => alert('Removed'),
    status: 'success',
    children: <div style={{ color: 'var(--theme-color-success)' }}>Uploaded</div>,
  },
};

const textFile = new File(['hello'], 'document.txt', { type: 'text/plain' });
const imageFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
const pdfFile = new File(['%PDF-1.4'], 'report.pdf', { type: 'application/pdf' });
const spreadsheetFile = new File([''], 'data-file-with-long-name-that-keeps-going.xlsx', {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
});

export const TextFile: Story = {
  args: {
    file: textFile,
    onRemove: () => alert('Removed text file'),
  },
};

export const ImageFile: Story = {
  args: {
    file: imageFile,
    onRemove: () => alert('Removed image file'),
  },
};

export const PdfFile: Story = {
  args: {
    file: pdfFile,
    onRemove: () => alert('Removed PDF file'),
  },
};

export const SpreadsheetFile: Story = {
  args: {
    file: spreadsheetFile,
    onRemove: () => alert('Removed spreadsheet file'),
  },
};
