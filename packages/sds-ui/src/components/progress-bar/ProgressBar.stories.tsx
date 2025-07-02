import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Feedback/Progress Bar',
  component: ProgressBar,
  argTypes: {
    variant: {
      options: ['secondary', 'primary', 'info'],
      control: { type: 'select' },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    value: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    showProgress: {
      control: { type: 'boolean' },
    },
    stopAnimation: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    value: 50,
    max: 100,
    showProgress: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    value: 50,
    max: 100,
    showProgress: true,
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    value: 50,
    max: 100,
    showProgress: true,
  },
};

export const CompleteProgress: Story = {
  args: {
    variant: 'primary',
    value: 100,
    max: 100,
    showProgress: true,
  },
};

export const StopAnimation: Story = {
  args: {
    variant: 'primary',
    value: 50,
    max: 100,
    showProgress: true,
    stopAnimation: true,
  },
};
