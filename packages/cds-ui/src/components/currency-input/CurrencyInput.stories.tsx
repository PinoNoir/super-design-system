import type { Meta, StoryObj } from '@storybook/react-vite';
import CurrencyInput from './CurrencyInput';

const meta: Meta<typeof CurrencyInput> = {
  title: 'Components/Inputs/Currency Input',
  component: CurrencyInput,
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    id: { type: 'string' },
    label: { type: 'string' },
    hideLabel: { type: 'boolean' },
    inline: { type: 'boolean' },
    initValue: { type: 'number' },
    placeholder: { type: 'string' },
    setZeroIfEmpty: { type: 'boolean' },
    showDollarSign: { type: 'boolean' },
    allowNa: { type: 'boolean' },
    acceptNaWithSlashFormat: { type: 'boolean' },
    isPercentage: { type: 'boolean' },
    disabled: { type: 'boolean' },
    invalid: { type: 'boolean' },
    className: { type: 'string' },
    onChange: {
      type: { name: 'function', required: true },
    },
    onChangeString: {
      type: { name: 'function' },
    },
    'automation-id': { type: 'string' },
  },
};

export default meta;

type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-1"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={1234.56}
        showDollarSign
        automation-id="currency-input"
      />
    );
  },
};

export const InlineLabelWithoutDollarSign: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-1"
        label="Currency Input"
        inline
        placeholder="Enter a currency value"
        initValue={500}
        showDollarSign={false}
      />
    );
  },
};

export const NoInitValue: Story = {
  render: () => {
    return (
      <CurrencyInput id="currency-input-1" label="Currency Input" placeholder="Enter a currency value" showDollarSign />
    );
  },
};

export const SetToZeroIfEmpty: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-1"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={0}
        setZeroIfEmpty
        showDollarSign
      />
    );
  },
};

export const AllowNa: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-1"
        label="Currency Input"
        placeholder="Enter a currency value"
        allowNa
        showDollarSign
      />
    );
  },
};

export const AcceptNaWithSlashFormat: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-1"
        label="Currency Input"
        placeholder="Enter a currency value"
        acceptNaWithSlashFormat
        allowNa={true}
        showDollarSign
        automation-id="currency-input"
        onChange={(val) => console.log('Value changed:', val)}
      />
    );
  },
};

export const Percentage: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="percentage-input"
        label="Percentage Input"
        placeholder="Enter a percentage value"
        initValue={25} // Will display as "25%"
        isPercentage
        showDollarSign={true} // This will be ignored for percentage inputs
        automation-id="percentage-input"
        onChange={(value) => console.log('Percentage value:', value)}
      />
    );
  },
};

export const PercentageWithNA: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-combined"
        label="Percentage with NA"
        placeholder="Enter percentage or NA"
        isPercentage
        allowNa
        acceptNaWithSlashFormat
        showDollarSign={false}
        automation-id="percentage-input-combined"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-2"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={5}
        disabled
        showDollarSign
      />
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-3"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={35.22}
        invalid
        invalidText="Invalid currency value"
        showDollarSign
      />
    );
  },
};

export const InvalidAndDisabled: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-3"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={35.22}
        disabled
        invalid
        invalidText="Invalid currency value"
        showDollarSign
      />
    );
  },
};

export const Warning: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-4"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={35.22}
        warn
        warnText="Warning: This value is too low"
        showDollarSign
      />
    );
  },
};

export const Success: Story = {
  render: () => {
    return (
      <CurrencyInput
        id="currency-input-5"
        label="Currency Input"
        placeholder="Enter a currency value"
        initValue={35.22}
        success
        successText="Success: This value is valid"
        showDollarSign
      />
    );
  },
};
