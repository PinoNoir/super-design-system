import type { Meta, StoryObj } from '@storybook/react-vite';
import IconButton from './IconButton';
import { Icon } from '@iconify/react';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    variant: {
      options: ['base', 'primary', 'secondary', 'tertiary'],
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: {
        type: 'select',
      },
    },
    fill: {
      options: ['outline', 'none', 'filled'],
      control: {
        type: 'select',
      },
    },
    shape: {
      options: ['square', 'bevel', 'round'],
      control: {
        type: 'select',
      },
    },
    onClick: {
      action: 'clicked',
    },
    ariaLabel: {
      control: {
        type: 'text',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: (args) => {
    return (
      <IconButton
        {...args}
        ariaLabel="Edit"
        onClick={() => {
          console.log('Icon Button clicked');
        }}
      >
        <Icon icon="mdi:pencil" />
      </IconButton>
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    return (
      <IconButton
        {...args}
        disabled
        ariaLabel="Edit"
        onClick={() => {
          console.log('Icon Button clicked');
        }}
      >
        <Icon icon="mdi:pencil" />
      </IconButton>
    );
  },
};

export const Primary: Story = {
  render: (args) => {
    return (
      <IconButton
        {...args}
        variant="primary"
        ariaLabel="Edit"
        onClick={() => {
          console.log('Icon Button clicked');
        }}
      >
        <Icon icon="mdi:pencil" />
      </IconButton>
    );
  },
};

export const Tertiary: Story = {
  render: (args) => {
    return (
      <IconButton
        {...args}
        variant="tertiary"
        ariaLabel="Edit"
        onClick={() => {
          console.log('Icon Button clicked');
        }}
      >
        <Icon icon="mdi:pencil" />
      </IconButton>
    );
  },
};
