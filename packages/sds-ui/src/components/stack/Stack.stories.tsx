import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../box';
import Stack, { StackProps } from './Stack';
import React from 'react';

const meta: Meta<typeof Stack> = {
  title: 'Layout Components/Stack',
  component: Stack,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
    gap: {
      options: ['8px', '16px', '24px', '32px'],
      control: { type: 'select' },
    },
    alignItems: {
      options: ['center', 'normal', 'flex-start', 'flex-end', 'self-start', 'self-end', 'stretch', 'baseline'],
      control: { type: 'select' },
    },
    justifyContent: {
      options: ['center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'space-evenly', 'stretch'],
      control: { type: 'select' },
    },
    flexDirection: {
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      control: { type: 'select' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args: StackProps) => (
    <Stack {...args} style={{ margin: 50 }}>
      <Box
        style={{
          display: 'flex',
          padding: '24px',
          width: '250px',
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          color: 'var(--color-neutral-40)',
          backgroundColor: 'var(--color-neutral-100)',
        }}
      >
        I'm a stacked div
      </Box>
      <Box
        style={{
          display: 'flex',
          padding: '24px',
          width: '250px',
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          color: 'var(--color-neutral-40)',
          backgroundColor: 'var(--color-neutral-100)',
        }}
      >
        I'm a stacked div
      </Box>
      <Box
        style={{
          display: 'flex',
          padding: '24px',
          width: '250px',
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          color: 'var(--color-neutral-40)',
          backgroundColor: 'var(--color-neutral-100)',
        }}
      >
        I'm a stacked div
      </Box>
    </Stack>
  ),
};
