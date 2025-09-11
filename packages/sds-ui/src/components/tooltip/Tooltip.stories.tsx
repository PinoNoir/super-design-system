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
    skipDelayDuration: {
      control: 'number',
    },
    disableHoverableContent: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    sticky: {
      control: 'select',
      options: ['partial', 'always'],
    },
    avoidCollisions: {
      control: 'boolean',
    },
    collisionPadding: {
      control: 'number',
    },
    sideOffset: {
      control: 'number',
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
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

export const WithHoverableContent: Story = {
  args: {
    children: (
      <Button variant="secondary" fill="outline">
        Hoverable Content
      </Button>
    ),
    description: 'This tooltip stays open when you hover over it.',
    disableHoverableContent: false,
    delayDuration: 300,
    skipDelayDuration: 100,
    side: 'top',
  },
};

export const AdvancedCollisionDetection: Story = {
  args: {
    children: (
      <Button variant="primary" fill="filled">
        Smart Positioning
      </Button>
    ),
    description: 'This tooltip has advanced collision detection and custom padding.',
    avoidCollisions: true,
    collisionPadding: 20,
    sideOffset: 8,
    side: 'top',
    align: 'center',
  },
};

export const TextLeftAligned: Story = {
  args: {
    children: (
      <Button variant="secondary" fill="outline">
        Left Aligned
      </Button>
    ),
    description: 'This tooltip text is aligned to the left.',
    textAlign: 'left',
    side: 'top',
  },
};

export const TextRightAligned: Story = {
  args: {
    children: (
      <Button variant="secondary" fill="outline">
        Right Aligned
      </Button>
    ),
    description: 'This tooltip text is aligned to the right.',
    textAlign: 'right',
    side: 'top',
  },
};

export const TextCenterAligned: Story = {
  args: {
    children: (
      <Button variant="secondary" fill="outline">
        Center Aligned
      </Button>
    ),
    description: 'This tooltip text is centered (default behavior).',
    textAlign: 'center',
    side: 'top',
  },
};
