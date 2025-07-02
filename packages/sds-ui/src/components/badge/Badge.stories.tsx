import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge, { BadgeProps } from './Badge';
import { ThemeProvider } from '../theme-provider';
import React from 'react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/UZTuFFY4hW0LryuLjnEEcQ/BCC-Components?type=design&node-id=31632%3A1853&mode=design&t=i4Msn3zdSBr7jHtZ-1',
    },
  },
  argTypes: {
    variant: {
      options: ['base', 'info', 'success', 'accent', 'warning', 'error'],
      control: { type: 'select' },
    },
    shape: {
      options: ['square', 'bevel', 'round'],
      control: { type: 'select' },
    },
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Base: Story = {
  render: (args) => {
    return (
      <Badge variant="base" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};

export const Info: Story = {
  render: (args) => {
    return (
      <Badge variant="info" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};

export const Success: Story = {
  render: (args) => {
    return (
      <Badge variant="success" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};

export const Accent: Story = {
  render: (args) => {
    return (
      <Badge variant="accent" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};

export const Warning: Story = {
  render: (args) => {
    return (
      <Badge variant="warning" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};

export const Error: Story = {
  render: (args) => {
    return (
      <Badge variant="error" shape="round" {...args}>
        Badge
      </Badge>
    );
  },
};
