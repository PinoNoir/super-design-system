import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import BaseInput, { BaseInputProps } from './components/BaseInput';
import CCInput, { CCInputProps } from './components/CCInput';
import PercentInput, { PercentInputProps } from './components/PercentInput';
import PhoneInput, { PhoneInputProps } from './components/PhoneInput';
import SSNInput, { SSNInputProps } from './components/SSNInput';
import DateInput, { DateInputProps } from './components/DateInput';

const meta: Meta<typeof BaseInput> = {
  title: 'Experimental/Dynamic Formatted Inputs',
  component: BaseInput,
  parameters: {
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
    invalidText: {
      control: { type: 'text' },
    },
    warnText: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
    defaultValue: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseInput>;

export const Default: Story = {
  render: (args: BaseInputProps) => <BaseInput {...args} id="text-input-1" type="text" label="Label text" />,
};

export const CreditCard: Story = {
  render: (args: CCInputProps) => {
    const [value, setValue] = React.useState<string | number>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
    };
    return (
      <CCInput
        {...args}
        id="cc-input-1"
        label="Enter Credit Card Number"
        showCardType={true}
        placeholder="1234 5678 9012 3456"
        value={value}
        onChange={handleChange}
      />
    );
  },
};

export const Percent: Story = {
  render: (args: PercentInputProps) => {
    const [value, setValue] = React.useState<string | number>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
    };
    return (
      <PercentInput
        {...args}
        id="percent-input-1"
        label="Percent Input"
        placeholder="Enter percentage"
        value={value}
        onChange={handleChange}
      />
    );
  },
};

export const PhoneNumber: Story = {
  render: (args: PhoneInputProps) => {
    const [value, setValue] = React.useState<string | number>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
    };
    return (
      <PhoneInput
        {...args}
        id="phone-input-1"
        label="Phone Number"
        placeholder="(123) 456-7890"
        value={value}
        onChange={handleChange}
      />
    );
  },
};

export const SocialSecurityNumber: Story = {
  render: (args: SSNInputProps) => {
    const [value, setValue] = React.useState<string | number>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
    };
    return (
      <SSNInput
        {...args}
        id="ss-input-1"
        label="Social Security Number"
        placeholder="xxx-xx-xxxx"
        value={value}
        onChange={handleChange}
      />
    );
  },
};

export const DateInputStory: Story = {
  render: (args: DateInputProps) => {
    const [value, setValue] = React.useState<string | number>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
    };
    return (
      <DateInput
        {...args}
        id="date-input-1"
        label="Date Input"
        placeholder="MM/DD/YYYY"
        value={value}
        onChange={handleChange}
      />
    );
  },
};
