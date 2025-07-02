import { Meta, StoryObj } from '@storybook/react-vite';
import SectionAlert from './SectionAlert';

const meta: Meta<typeof SectionAlert> = {
  title: 'Components/Feedback/Section Alert',
  component: SectionAlert,
  argTypes: {
    variant: {
      options: ['info', 'success', 'error', 'warning'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SectionAlert>;

export const Default: Story = {
  args: {
    variant: 'info',
    message: 'This is some information.',
  },
};

export const withHeader: Story = {
  args: {
    variant: 'info',
    message: 'This is some information.',
    hasHeader: true,
  },
};

export const withLink: Story = {
  args: {
    variant: 'success',
    message: 'This is a success message.',
    link: '#',
    linkText: ' This is an optional link',
  },
};

export const withAdditionalMessage: Story = {
  args: {
    variant: 'error',
    message: 'This is an error message.',
    additionalBoldMessage: 'This is an additional bold message.',
    link: '#',
    linkText: undefined,
  },
};

export const withCustomHeader: Story = {
  args: {
    header: 'This is a Custom Heading',
    hasHeader: true,
    variant: 'info',
    message: 'This is a message.',
    additionalBoldMessage: 'This is an additional bold message.',
    link: '#',
    linkText: undefined,
  },
};
