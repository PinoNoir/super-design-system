import type { Meta, StoryObj } from '@storybook/react-vite';
import TextInput, { TextInputProps } from './TextInput';
import React from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Inputs/Text Input',
  component: TextInput,
  parameters: {
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
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
    placeholder: {
      control: { type: 'text' },
    },
    successText: {
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

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  render: (args: TextInputProps) => <TextInput {...args} id="text-input-1" type="text" label="Label text" />,
};

export const ReadOnlyWithHelperText: Story = {
  render: (args: TextInputProps) => (
    <TextInput
      {...args}
      id="text-input-1"
      label="Text input label"
      helperText="Optional help text"
      value="This is read only, you can't type more."
      readOnly
    />
  ),
};

export const NumberInput: Story = {
  render: () => (
    <TextInput
      id="number-input-1"
      type="number"
      name="quantity"
      min="0"
      max="999"
      label="Number Input"
      helperText="Only numbers are allowed."
    />
  ),
};

export const WithCounter: Story = {
  render: function WithCounter() {
    const [value, setValue] = React.useState('');
    const maxCount = 50;

    return (
      <TextInput
        id="text-input-counter"
        label="Text Input with Counter"
        helperText="Type to see the counter in action"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        enableCounter={true}
        maxCount={maxCount}
      />
    );
  },
};

export const Playground: Story = {
  decorators: [
    (Story) => {
      const [value, setValue] = React.useState('');
      return <Story stateValue={value} setStateValue={setValue} />;
    },
  ],
  render: function Playground(args, { stateValue, setStateValue }) {
    const maxCount = args.maxCount || 100;
    const exceedsMaxCount = stateValue.toString().length > maxCount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStateValue(e.target.value);
      if (args.onChange) {
        args.onChange(e);
      }
    };

    const { value, onChange, ...restArgs } = args;

    return (
      <div style={{ width: args.width }}>
        <TextInput
          {...restArgs}
          id="text-input-1"
          type="text"
          value={stateValue}
          onChange={handleChange}
          enableCounter={args.enableCounter}
          maxCount={maxCount}
          invalid={args.invalid || exceedsMaxCount}
          invalidText={exceedsMaxCount ? `Maximum ${maxCount} characters allowed` : args.invalidText}
        />
      </div>
    );
  },
};

Playground.args = {
  width: 300,
  className: 'input-test-class',
  placeholder: 'Placeholder text',
  invalid: false,
  invalidText: 'Error message goes here',
  disabled: false,
  label: 'Label text',
  helperText: 'Helper text',
  warn: false,
  warnText: 'Warning message that is really long can wrap to more lines but should not be excessively long.',
  readOnly: false,
  success: false,
  successText: 'Success message goes here',
  enableCounter: true,
  maxCount: 100,
  value: '',
};

Playground.argTypes = {
  width: {
    control: { type: 'range', min: 300, max: 800, step: 50 },
  },
  className: {
    control: {
      type: 'text',
    },
  },
  defaultValue: {
    control: {
      type: 'text',
    },
  },
  placeholder: {
    control: {
      type: 'text',
    },
  },
  invalid: {
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  label: {
    control: {
      type: 'text',
    },
  },
  helperText: {
    control: {
      type: 'text',
    },
  },
  warn: {
    control: {
      type: 'boolean',
    },
  },
  warnText: {
    control: {
      type: 'text',
    },
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  success: {
    control: {
      type: 'boolean',
    },
  },
  successText: {
    control: {
      type: 'text',
    },
  },
  value: {
    control: {
      type: 'text',
    },
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  enableCounter: {
    control: { type: 'boolean' },
  },
  maxCount: {
    control: { type: 'number' },
  },
};
