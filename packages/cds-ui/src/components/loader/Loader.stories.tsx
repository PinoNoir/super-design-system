import type { Meta, StoryObj } from '@storybook/react-vite';
import Loader from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Components/Feedback/Loader',
  component: Loader,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    withOverlay: { control: 'boolean' },
    description: { control: 'text' },
    showDescription: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    withOverlay: false,
    description: 'Loading...',
    showDescription: true,
  },
};

export const withOverlay: Story = {
  args: {
    withOverlay: true,
    description: 'This is a custom description',
    showDescription: true,
  },
};
