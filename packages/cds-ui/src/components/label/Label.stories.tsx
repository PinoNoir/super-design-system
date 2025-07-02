import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';

const meta: Meta<typeof Label> = {
  title: 'Components/Text/Label',
  component: Label,
  argTypes: {
    children: {
      control: {
        type: 'object',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    hasIcon: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => <Label {...args}>Label</Label>,
};
