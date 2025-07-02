import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import RadioButton from './RadioButton';
import RadioButtonGroup from './RadioButtonGroup';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/Inputs/Radio Button ',
  component: RadioButton,
  argTypes: {
    id: { control: 'text' },
    className: { control: 'text' },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'onChange' },
    onClick: { action: 'onClick' },
  },
};
export default meta;

type Story = StoryObj<typeof RadioButton>;

export const UncontrolledHorizontalOrientation: Story = {
  render: () => (
    <RadioButtonGroup
      legendText="Uncontrolled Horizontal Orientation"
      name="uncontrolled-horizontal-radio-button-group"
      defaultSelected="radio-1"
      orientation="horizontal"
    >
      <RadioButton label="Radio button 1" value="radio-1" id="radio-1" />
      <RadioButton label="Radio button 2" value="radio-2" id="radio-2" />
      <RadioButton label="Radio button 3" value="radio-3" id="radio-3" disabled />
    </RadioButtonGroup>
  ),
};

export const ControlledHorizontalOrientation: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | number>('radio-4');
    return (
      <RadioButtonGroup
        legendText="Controlled Horizontal Orientation"
        name="controlled-horizontal-radio-button-group"
        valueSelected={selected}
        onChange={(value) => setSelected(value)}
        orientation="horizontal"
      >
        <RadioButton label="Radio button 4" value="radio-4" id="radio-4" />
        <RadioButton label="Radio button 5" value="radio-5" id="radio-5" />
        <RadioButton label="Radio button 6" value="radio-6" id="radio-6" />
      </RadioButtonGroup>
    );
  },
};

export const UncontrolledVerticalOrientation: Story = {
  render: () => (
    <RadioButtonGroup
      legendText="Uncontrolled Vertical Orientation"
      name="uncontrolled-vertical-radio-button-group"
      defaultSelected="radio-1"
      orientation="vertical"
    >
      <RadioButton label="Radio button 7" value="radio-7" id="radio-7" />
      <RadioButton label="Radio button 8" value="radio-8" id="radio-8" />
      <RadioButton label="Radio button 9" value="radio-9" id="radio-9" />
    </RadioButtonGroup>
  ),
};

export const ControlledVerticalOrientation: Story = {
  render: () => {
    const [selected, setSelected] = useState('radio-1');

    console.log('Render: Current selected value:', selected);

    const handleChange = (value, name, event) => {
      console.log('onChange called with:', value, name, event);
      setSelected(value);
    };

    return (
      <RadioButtonGroup
        legendText="Controlled Vertical Orientation"
        name="controlled-vertical-radio-button-group"
        valueSelected={selected}
        onChange={handleChange}
        orientation="vertical"
      >
        <RadioButton label="Radio button 10" value="radio-10" id="radio-10" />
        <RadioButton label="Radio button 11" value="radio-11" id="radio-11" />
        <RadioButton label="Radio button 12" value="radio-12" id="radio-12" />
      </RadioButtonGroup>
    );
  },
};

export const DisabledRadioGroup: Story = {
  render: () => (
    <RadioButtonGroup
      legendText="Disabled Radio Group"
      name="disabled-radio-button-group"
      orientation="vertical"
      disabled
    >
      <RadioButton label="Radio button 13" value="radio-13" id="radio-13" />
      <RadioButton label="Radio button 14" value="radio-14" id="radio-14" />
      <RadioButton label="Radio button 15" value="radio-15" id="radio-15" />
    </RadioButtonGroup>
  ),
};

export const InvalidRadioGroup: Story = {
  render: () => (
    <RadioButtonGroup
      legendText="Invalid Radio Group"
      name="invalid-radio-button-group"
      defaultSelected="radio-1"
      orientation="vertical"
      invalid
      invalidText="This selection is not valid, please choose another option."
    >
      <RadioButton label="Radio button label" value="radio-16" id="radio-16" />
      <RadioButton label="Radio button label" value="radio-17" id="radio-17" />
      <RadioButton label="Radio button label" value="radio-18" id="radio-18" />
    </RadioButtonGroup>
  ),
};
