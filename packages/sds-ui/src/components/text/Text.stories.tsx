import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text/Text',
  component: Text,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    as: {
      options: ['a', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
    color: {
      options: ['base', 'primary', 'secondary', 'tertiary', 'accent', 'info', 'success', 'warning', 'error'],
      control: { type: 'select' },
    },
    size: {
      options: ['xs', 'small', 'body', 'large', 'xl', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'Text component',
    color: 'base',
    size: 'body',
    as: 'p',
  },
};
