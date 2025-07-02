import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { Container } from '../container';
import { MenuItem, Select } from '../select';
import { Box } from '../box';

const meta: Meta<typeof Modal> = {
  title: 'Components/Popovers/Modal',
  component: Modal,
  argTypes: {
    width: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    trigger: {
      control: { type: 'object' },
    },
    title: {
      control: { type: 'text' },
    },
    children: {
      control: { type: 'text' },
    },
    footer: {
      control: { type: 'object' },
    },
    ['automation-id']: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
    open: {
      control: { type: 'boolean' },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function DefaultRender(args) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      console.log('Modal closed');
      setIsOpen(false);
    };

    const handleSave = () => {
      console.log('Data saved');
      handleClose();
    };

    const handleSecondaryAction = () => {
      console.log('Secondary action clicked');
      // Perform your secondary action logic here
    };

    return (
      <Modal
        {...args}
        title="Basic Modal"
        open={isOpen}
        width="large"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        onClose={handleClose}
        onSave={handleSave}
        actionButtons={[
          {
            text: 'Secondary Action',
            variant: 'secondary',
            onClick: handleSecondaryAction,
          },
        ]}
        closeButtonLabel="Cancel"
        saveButtonLabel="Save Data"
        disablePrimaryButton={true}
      >
        <p>This is a simple modal.</p>
      </Modal>
    );
  },
};

export const PreventClose: Story = {
  render: function PreventCloseRender(args) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleSave = () => {
      console.log('Data saved');
      handleClose();
    };

    const handleRequestClose = () => {
      if (window.confirm('Are you sure you want to close this modal?')) {
        handleClose();
      }
    };

    const handleSecondaryAction = () => {
      console.log('Secondary action clicked');
      // Perform your secondary action logic here
    };

    return (
      <Modal
        {...args}
        title="Modal with Unsaved Changes"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        open={isOpen}
        width="medium"
        onClose={handleRequestClose}
        onSave={handleSave}
        actionButtons={[
          {
            text: 'Secondary Action',
            variant: 'secondary',
            onClick: handleSecondaryAction,
          },
        ]}
        closeButtonLabel="Cancel"
      >
        <Container padding="4px">
          <TextInput id="demo" label="Name" defaultValue="Unsaved text" />
        </Container>
      </Modal>
    );
  },
};

export const ScrollToTop: Story = {
  render: function ScrollToTopRender(args) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      window.scrollTo(0, 0);
    };

    return (
      <Modal
        {...args}
        title="Modal with Overflowing Content"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        open={isOpen}
        width="large"
        onClose={handleClose}
        onSave={handleClose}
        actionButtons={[
          {
            text: 'Tertiary Action',
            variant: 'tertiary',
            onClick: () => {
              console.log('Tertiary action clicked');
            },
          },
        ]}
        closeButtonLabel="Close"
      >
        <div>
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index}>This is a long list of items...</p>
          ))}
        </div>
      </Modal>
    );
  },
};

export const CustomTrigger: Story = {
  render: function CustomTriggerRender(args) {
    const users = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
      { id: '3', name: 'User 3' },
      { id: '4', name: 'User 4' },
      { id: '5', name: 'User 5' },
      { id: '6', name: 'User 6' },
      { id: '7', name: 'User 7' },
      { id: '8', name: 'User 8' },
      { id: '9', name: 'User 9' },
      { id: '10', name: 'User 10' },
    ];

    const [selectedValue, setSelectedValue] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleChange = (event: { target: { value: string } }) => {
      setSelectedValue(event.target.value);
      console.log(`Selected user: ${event.target.value}`);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    return (
      <Modal
        {...args}
        title="Modal with Custom Trigger"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        open={isOpen}
        onClose={handleClose}
        onSave={handleClose}
        width="medium"
        actionButtons={[
          {
            text: 'Secondary Action',
            variant: 'primary',
            onClick: () => {
              console.log('Secondary action clicked');
            },
          },
        ]}
        closeButtonLabel="Close"
        saveButtonLabel="Save User"
      >
        <Select
          {...args}
          id="test"
          label="Select a User"
          placeholder="Select a user"
          value={selectedValue}
          onChange={handleChange}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.name}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        <Box marginBlock="16">
          <p>Selected user: {selectedValue}</p>
        </Box>
      </Modal>
    );
  },
};

export const CustomFooter: Story = {
  render: function CustomFooterRender(args) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleSave = () => {
      console.log('Data saved');
      handleClose();
    };

    return (
      <Modal
        {...args}
        title="Modal with Custom Footer"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        open={isOpen}
        width="medium"
        onClose={handleClose}
        onSave={handleSave}
        footer={
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap="16">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Data
            </Button>
          </Box>
        }
      >
        <p>This modal has a custom footer.</p>
      </Modal>
    );
  },
};

export const disableCloseOnOverlayClick: Story = {
  render: function DisableCloseOnOverlayClickRender(args) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleSave = () => {
      console.log('Data saved');
    };

    return (
      <Modal
        {...args}
        title="Modal with Disabled Close"
        trigger={
          <Button variant="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        }
        open={isOpen}
        width="medium"
        onSave={handleSave}
        onClose={handleClose}
        closeButtonLabel="Close"
        disableCloseOnOverlayClick
      >
        <p>The user should not be able to click outside of the modal to close it.</p>
      </Modal>
    );
  },
};
