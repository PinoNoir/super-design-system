import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../button/Button';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Popovers/Tooltip',
  component: Tooltip,

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    children: {
      control: false,
    },
    description: {
      control: 'text',
    },
    delayDuration: {
      control: 'number',
    },
    defaultOpen: {
      control: 'boolean',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: {
    children: (
      <Button variant="primary" fill="filled">
        Tooltip Trigger
      </Button>
    ),
    description: 'This is some basic Tooltip content.',
    delayDuration: 100,
    side: 'top',
  },
};

export const WithLongText: Story = {
  args: {
    children: (
      <Button variant="secondary" fill="outline">
        Hover me
      </Button>
    ),
    description:
      'This tooltip contains a longer description to demonstrate how it wraps and handles more content gracefully.',
    delayDuration: 200,
    side: 'bottom',
  },
};

export const DelayedTooltip: Story = {
  args: {
    children: (
      <Button variant="danger" fill="outline">
        Destructive Action
      </Button>
    ),
    description: 'This tooltip appears after a longer delay.',
    delayDuration: 1000,
    side: 'top',
  },
};

export const PositionedRight: Story = {
  args: {
    children: (
      <Button variant="primary" fill="filled">
        Right Tooltip
      </Button>
    ),
    description: 'Tooltip appears on the right.',
    delayDuration: 100,
    side: 'right',
  },
};

export const PositionedLeft: Story = {
  args: {
    children: (
      <Button variant="primary" fill="filled">
        Left Tooltip
      </Button>
    ),
    description: 'Tooltip appears on the left.',
    delayDuration: 100,
    side: 'left',
  },
};

export const AlwaysOpen: Story = {
  args: {
    children: (
      <Button variant="primary" fill="filled">
        Always Open
      </Button>
    ),
    description: 'This tooltip is always open for demonstration.',
    open: true,
    side: 'top',
  },
};
