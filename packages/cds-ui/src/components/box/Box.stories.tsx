import type { Meta, StoryObj } from '@storybook/react-vite';
import Box from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout Components/Box',
  component: Box,
  tags: ['!autodocs'],
};
export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: (args) => (
    <Box
      {...args}
      display="flex"
      p="24"
      w="fit-content"
      borderRadius="4"
      justifyContent="center"
      alignItems="center"
      bg="neutral-20"
    >
      <p>This is some centered content in the Box component.</p>
    </Box>
  ),
};
