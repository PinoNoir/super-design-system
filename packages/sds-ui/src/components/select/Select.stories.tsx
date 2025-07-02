import { Meta, StoryObj } from '@storybook/react-vite';
import Select, { SelectProps } from './Select';
import MenuItem from './MenuItem';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  subcomponents: { MenuItem },
  argTypes: {
    label: { type: 'string' },
    disabled: { type: 'boolean' },
    hideLabel: { type: 'boolean' },
    onChange: {
      action: 'onChange',
      type: 'function',
    },
    value: { type: 'string' },
    defaultValue: { type: 'string' },
    required: { type: 'boolean' },
    placeholder: { type: 'string' },
    invalid: { type: 'boolean' },
    invalidText: { type: 'string' },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

// Default Select Example

interface users {
  id: string;
  name: string;
}

const users: users[] = [
  { id: '1', name: '100' },
  { id: '2', name: '200' },
  { id: '3', name: '300' },
  { id: '4', name: '400' },
  { id: '5', name: '500' },
  { id: '6', name: '600' },
  { id: '7', name: '700' },
  { id: '8', name: '800' },
  { id: '9', name: '900' },
  { id: '10', name: '950' },
];

// Single Value Selected Example
export const SingleValueSelection: Story = {
  render: function SingleValueSelection(args: SelectProps) {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleChange = (event: { target: { value: string } }) => {
      setSelectedValue(event.target.value);
      console.log(`Selected user: ${event.target.value}`);
    };

    return (
      <Select
        {...args}
        id="test"
        label="Select a User"
        placeholder="Select a User"
        value={selectedValue}
        onChange={handleChange}
      >
        <MenuItem value="None">None</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
};

// Disabled Select Example
export const Disabled: Story = {
  render: function Disabled(args: SelectProps) {
    return (
      <Select {...args} id="test" label="Select a User" disabled={true} placeholder="disabled">
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
};

// Required Select Example
export const Required: Story = {
  render: function Required(args: SelectProps) {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleChange = (event: { target: { value: string } }) => {
      setSelectedValue(event.target.value);
      console.log(`Selected user: ${event.target.value}`);
    };

    return (
      <Select
        {...args}
        id="test"
        label="Select a User"
        required={true}
        placeholder="Select a User"
        value={selectedValue}
        onChange={handleChange}
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
};

// Invalid Select Example
export const Invalid: Story = {
  render: function Invalid(args: SelectProps) {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const isInvalid = selectedValue === '';

    const handleChange = (event: { target: { value: string } }) => {
      setSelectedValue(event.target.value);
      console.log(`Selected user: ${event.target.value}`);
    };

    return (
      <Select
        {...args}
        id="test"
        label="Select a User"
        required
        invalid={isInvalid}
        invalidText="Please select a valid user"
        placeholder="Select a User"
        value={selectedValue}
        onChange={handleChange}
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
};

// Inline Label Select Example
export const InlineLabel: Story = {
  render: function InlineLable(args: SelectProps) {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleChange = (event: { target: { value: string } }) => {
      setSelectedValue(event.target.value);
      console.log(`Selected user: ${event.target.value}`);
    };

    return (
      <Select
        {...args}
        id="test"
        label="Select a User"
        inline={true}
        placeholder="Select a User"
        value={selectedValue}
        onChange={handleChange}
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
};
