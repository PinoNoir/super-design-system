import type { Meta, StoryObj } from '@storybook/react-vite';
import Container from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout Components/Container',
  component: Container,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
    overflow: {
      options: ['hidden', 'clip', 'visible', 'scroll', 'auto', 'unset'],
      control: { type: 'select' },
    },
    justifyContent: {
      options: ['center', 'spaceAround', 'spaceBetween', 'stretch', 'flexEnd', 'flexStart'],
      control: { type: 'select' },
    },
    display: {
      options: ['flex', 'inlineFlex', 'block', 'inlineBlock', 'grid', 'none'],
      control: { type: 'select' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    display: 'flex',
    overflow: 'auto',
    justifyContent: 'center',
    padding: '16px',
    children: <p>This is some content in the container.</p>,
  },
};
