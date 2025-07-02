import type { Meta, StoryObj } from '@storybook/react-vite';
import Avatar from './Avatar';
import profilePic from '../../public/profile-pic.jpg';
import { Icon } from '@iconify/react';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Media/Avatar',
  component: Avatar,
  argTypes: {
    isLoggedIn: {
      control: { type: 'boolean' },
      defaultValue: true, // Assuming most stories show logged-in state
    },
    username: {
      control: { type: 'text' },
    },
    size: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
    src: {
      control: { type: 'text' }, // Changed to 'text' to allow inputting any string path
    },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const LoggedInWithImage: Story = {
  args: {
    isLoggedIn: true,
    username: 'Nicholas Pino',
    size: 'md',
    src: profilePic,
  },
};

export const LoggedInNoImage: Story = {
  args: {
    isLoggedIn: true,
    username: 'Nicholas Pino',
    size: 'md',
    src: null, // Explicitly showing no image
  },
};

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
    size: 'md',
    // No `src` and `username` needed for logged-out state
  },
};

export const CustomPlaceholder: Story = {
  args: {
    isLoggedIn: false,
    size: 'md',
    children: <Icon icon="mdi:account" width="24px" />, // Custom placeholder icon or text
  },
};
