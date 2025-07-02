import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Checkbox, { CheckboxProps } from './Checkbox';
import React from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/UZTuFFY4hW0LryuLjnEEcQ/BCC-Components?type=design&node-id=34895%3A6962&mode=design&t=dRUEL0dBfLD4z07w-1',
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    onChange: {
      action: 'onChange',
      type: 'function',
    },
    disabled: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  render: (args: CheckboxProps) => <Checkbox {...args} label="Default checkbox" />,
};

const ControlledCheckbox: React.FC<CheckboxProps> = (args) => {
  const [checked, setChecked] = React.useState<boolean>(false);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
      label="Controlled checkbox"
    />
  );
};

export const Controlled: Story = {
  render: (args: CheckboxProps) => <ControlledCheckbox {...args} />,
};

export const Disabled: Story = {
  render: (args: CheckboxProps) => <Checkbox {...args} disabled label="Disabled checkbox" />,
};

export const Indeterminate: Story = {
  render: (args) => <Checkbox {...args} indeterminate label="Indeterminate checkbox" />,
};
