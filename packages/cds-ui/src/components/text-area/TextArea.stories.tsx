import { Meta, StoryObj } from '@storybook/react-vite';
import TextArea from './TextArea';

const meta: Meta = {
  title: 'Components/Inputs/Text Area',
  component: TextArea,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    maxCharacters: {
      control: {
        type: 'number',
        min: 1,
        max: 1000,
        step: 1,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Basic: Story = {
  args: {
    id: 'text-area-basic',
    label: 'Basic Text Area',
    helperText: 'This is some helper text',
    textCounter: true,
    maxCharacters: 250,
  },
};

export const Disabled: Story = {
  args: {
    id: 'text-area-disabled',
    label: 'Disabled Text Area',
    disabled: true,
    helperText: 'This is some helper text',
    textCounter: true,
    maxCharacters: 100,
  },
};
