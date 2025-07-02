import { Meta, StoryObj } from '@storybook/react-vite';
import Switch, { CustomSwitchProps } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  argTypes: {
    asChild: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    label: { control: 'text' },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    onCheckedChange: { action: 'onCheckedChange' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: (args: CustomSwitchProps) => <Switch hideLabel={false} disabled={false} defaultChecked={false} {...args} />,
};

export const LabelHidden: Story = {
  render: (args: CustomSwitchProps) => <Switch hideLabel={true} label="This is a label" {...args} />,
};

export const Disabled: Story = {
  render: (args: CustomSwitchProps) => <Switch disabled={true} {...args} />,
};
