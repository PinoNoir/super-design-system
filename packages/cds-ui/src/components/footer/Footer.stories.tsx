import { Meta, StoryObj } from '@storybook/react-vite';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Navigation/Footer',
  component: Footer,
  argTypes: {
    links: {
      control: {
        type: 'object',
      },
    },
    supportPhone: {
      control: {
        type: 'text',
      },
    },
    backgroundColor: {
      control: {
        type: 'text',
      },
    },
    borderTop: {
      control: {
        type: 'text',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    links: [
      { label: 'Terms and Conditions ', url: '#' },
      { label: 'Privacy Policy ', url: '#' },
    ],
    supportPhone: '(800) 999 9999',
  },
};
