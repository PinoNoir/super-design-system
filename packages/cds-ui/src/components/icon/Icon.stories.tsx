import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from './Icon';
import { iconNames } from './utils/iconNames';

const meta: Meta<typeof Icon> = {
  title: 'Experimental/Icon',
  component: Icon,
  tags: ['!autodocs'],
  argTypes: {
    name: {
      options: iconNames,
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['small', 'default', 'large'],
      control: {
        type: 'select',
      },
    },
    color: {
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent', 'info', 'success', 'warning', 'error'],
      control: {
        type: 'select',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'mdi-account',
    color: 'default',
    size: 'default',
  },
};
