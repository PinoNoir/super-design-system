import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Combobox from './Combobox';
import { Modal } from '../modal';
import { TextInput } from '../text-input';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Inputs/Combobox',
  component: Combobox,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    options: {
      disable: true,
      description: 'Array of options to display in the dropdown',
    },
    label: {
      control: 'text',
      description: 'Label for the input',
    },
    hideLabel: {
      control: 'boolean',
      description: 'Hides the label visually but keeps it accessible to screen readers',
    },
    onSelect: {
      action: 'selected',
      description: 'Function called when an option is selected',
    },
    onSave: {
      action: 'saved',
      description: 'Function called when a new option is saved',
    },
    onAddNew: {
      action: 'addNew',
      description: 'Function called when the "Add New" option is clicked',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const options = ['Watts, Bill', 'Watts, Mary', 'Walshe, John', 'Walshe, Betty'];
    return (
      <Combobox
        label="Link Client"
        placeholder="Search clients..."
        options={options}
        onSelect={(option) => console.log('Selected:', option)}
        onSave={(option) => console.log('Saved:', option)}
      />
    );
  },
};

export const WithCustomOptions: Story = {
  render: () => {
    const [options, setOptions] = useState(['Watts, Bill', 'Watts, Mary', 'Walshe, John', 'Walshe, Betty']);
    return (
      <Combobox
        label="Link Client"
        placeholder="Search clients..."
        options={options}
        onSelect={(option) => console.log('Selected:', option)}
        onSave={(option) => {
          console.log('Saved:', option);
          setOptions([...options, option]);
        }}
      />
    );
  },
};

export const WithAddNewFunctionality: Story = {
  render: () => {
    const [options, setOptions] = useState(['Watts, Bill', 'Watts, Mary', 'Walshe, John', 'Walshe, Betty']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newValue, setNewValue] = useState('');

    const handleAddNew = () => {
      setIsModalOpen(true);
    };

    const handleSaveNewValue = () => {
      if (newValue && !options.includes(newValue)) {
        setOptions([...options, newValue]);
        setNewValue('');
      }
      setIsModalOpen(false);
    };

    return (
      <div>
        <Combobox
          label="Link Client"
          placeholder="Search clients..."
          allowAddNew
          options={options}
          onSelect={(option) => console.log('Selected:', option)}
          onSave={(option) => {
            console.log('Saved:', option);
            setOptions([...options, option]);
          }}
          onAddNew={handleAddNew}
        />
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            title="Add New Client"
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNewValue}
            width="medium"
            closeButtonLabel="Close"
            saveButtonLabel="Save Client"
          >
            <TextInput
              id="new-client-name"
              label="New Client Name"
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter new value"
            />
          </Modal>
        )}
      </div>
    );
  },
};
