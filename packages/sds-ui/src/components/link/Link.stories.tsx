import type { Meta, StoryObj } from '@storybook/react-vite';
import Link from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Text/Link',
  component: Link,
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: 'This is a Link component',
  },
};
