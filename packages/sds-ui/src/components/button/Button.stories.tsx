import { Icon } from '@iconify/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';
import React from 'react';

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/UZTuFFY4hW0LryuLjnEEcQ/BCC-Components?node-id=4267-2811&t=dpBHIkk4Yq1iXgJo-4',
    },
  },
  argTypes: {
    variant: {
      options: ['base', 'primary', 'secondary', 'tertiary', 'accent', 'danger'],
      control: { type: 'select' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    fill: {
      options: ['outline', 'none', 'filled'],
      control: { type: 'select' },
    },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    children: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
  },
};

export const Small: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'small',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
  },
};

export const Large: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'large',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
  },
};

export const WithIconOnLeft: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
    icon: <Icon icon="mdi:plus-circle" />,
    iconPosition: 'left',
  },
};

export const WithIconOnRight: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
    icon: <Icon icon="mdi:plus-circle" />,
    iconPosition: 'right',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Button',
    variant: 'tertiary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: false,
  },
};

export const danger: Story = {
  args: {
    children: 'Button',
    variant: 'danger',
    size: 'medium',
    fill: 'outline',
    isDisabled: false,
    isLoading: false,
  },
};

export const isLoading: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    fill: 'filled',
    isDisabled: false,
    isLoading: true,
  },
};
