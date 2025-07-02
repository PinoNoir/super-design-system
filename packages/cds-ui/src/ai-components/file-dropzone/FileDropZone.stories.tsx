import { Meta, StoryObj } from '@storybook/react-vite';
import FileDropZone from './FileDropZone';

const meta: Meta<typeof FileDropZone> = {
  title: 'AI Components/File Dropzone',
  component: FileDropZone,
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onFilesSelected: {
      description: 'Callback when files are selected or dropped',
      action: 'files selected',
      control: false,
    },
    className: {
      description: 'Custom class name for the drop zone',
      control: 'text',
    },
    style: {
      description: 'Inline styles for the drop zone',
      control: 'object',
    },
    disableDefaultStyles: {
      description: 'Disable default CSS module styles',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileDropZone>;

export const Default: Story = {
  args: {
    onFilesSelected: (files: FileList) => {
      alert(
        `Selected ${files.length} file(s):\n` +
          Array.from(files)
            .map((f) => f.name)
            .join('\n'),
      );
    },
  },
};

export const WithCustomHandler: Story = {
  args: {
    onFilesSelected: (files: FileList) => {
      console.log('Files received:', files);
    },
  },
};

export const StyledDropZone: Story = {
  args: {
    disableDefaultStyles: true,
    style: {
      border: '2px dashed #ff6600',
      borderRadius: '12px',
      padding: '3rem',
      backgroundColor: '#fffaf0',
      color: '#ff6600',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    onFilesSelected: (files: FileList) => {
      alert(
        `You dropped: ${Array.from(files)
          .map((f) => f.name)
          .join(', ')}`,
      );
    },
  },
};
