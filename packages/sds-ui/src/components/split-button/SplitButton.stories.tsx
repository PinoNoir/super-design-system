import type { Meta, StoryObj } from '@storybook/react-vite';
import SplitButton from './SplitButton';

const meta: Meta<typeof SplitButton> = {
  title: 'Components/Buttons/Split Button',
  component: SplitButton,
  argTypes: {
    variant: {
      options: ['base', 'primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SplitButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    onClick: () => console.log('Main button clicked'),
    dropdownItems: [
      { label: 'Option 1', onClick: () => console.log('Option 1') },
      { label: 'Option 2', onClick: () => console.log('Option 2') },
      { label: 'Option 3', onClick: () => console.log('Option 3') },
    ],
    children: 'Split Button',
  },
};

export const Secondary: Story = {
  args: {
    onClick: () => console.log('Main button clicked'),
    variant: 'secondary',
    dropdownItems: [
      { heading: 'Option 1', label: 'Option 1', onClick: () => console.log('Option 1') },
      { heading: 'Option 2', label: 'Option 2', onClick: () => console.log('Option 2') },
      { heading: 'Option 3', label: 'Option 3', onClick: () => console.log('Option 3') },
    ],
    children: 'Split Button',
  },
};

export const Tertiary: Story = {
  args: {
    onClick: () => console.log('Main button clicked'),
    variant: 'tertiary',
    dropdownItems: [
      { label: 'Option 1', onClick: () => console.log('Option 1') },
      { label: 'Option 2', onClick: () => console.log('Option 2') },
      { label: 'Option 3', onClick: () => console.log('Option 3') },
    ],
    children: 'Split Button',
  },
};

export const Disabled: Story = {
  args: {
    onClick: () => console.log('Main button clicked'),
    variant: 'secondary',
    disabled: true,
    dropdownItems: [
      { label: 'Option 1', onClick: () => console.log('Option 1') },
      { label: 'Option 2', onClick: () => console.log('Option 2') },
      { label: 'Option 3', onClick: () => console.log('Option 3') },
    ],
    children: 'Split Button',
  },
};
