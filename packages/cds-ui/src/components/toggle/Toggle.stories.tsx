import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleButton, { ToggleButtonProps } from './Toggle';
import { Icon } from '@iconify/react';

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/Buttons/ToggleButton',
  component: ToggleButton,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    value: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

// Wrapper component to handle state
const ToggleWrapper = (args: ToggleButtonProps) => {
  const [value, setValue] = useState<'left' | 'right'>(args.value || 'left');
  return (
    <ToggleButton
      {...args}
      value={value}
      onToggle={(newValue) => {
        setValue(newValue);
        args.onToggle?.(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: ToggleWrapper,
  args: {
    leftLabel: 'Person',
    leftIcon: <Icon icon="mdi:account" />,
    rightLabel: 'Business',
    rightIcon: <Icon icon="mdi:city" />,
    variant: 'primary',
    value: 'left',
  },
};

export const PrimaryToggle: Story = {
  render: ToggleWrapper,
  args: {
    ...Default.args,
    variant: 'primary',
  },
};

export const SecondaryToggle: Story = {
  render: ToggleWrapper,
  args: {
    ...Default.args,
    variant: 'secondary',
  },
};

export const TertiaryToggle: Story = {
  render: ToggleWrapper,
  args: {
    ...Default.args,
    variant: 'tertiary',
  },
};

export const InitialRight: Story = {
  render: ToggleWrapper,
  args: {
    ...Default.args,
    value: 'right',
  },
};

export const NoIcons: Story = {
  render: ToggleWrapper,
  args: {
    ...Default.args,
    leftIcon: undefined,
    rightIcon: undefined,
  },
};
