import { Meta, StoryObj } from '@storybook/react-vite';
import Dialog from './Dialog';
import DialogHeader from './DialogHeader';
import DialogBody from './DialogBody';
import DialogFooter from './DialogFooter';
import React from 'react';
import { Button } from '../button';

const meta: Meta = {
  title: 'Components/Popovers/Dialog',
  component: Dialog,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const SimpleDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
      <>
        <Button variant="primary" onClick={openDialog}>
          Open Dialog
        </Button>
        <Dialog open={isOpen} onClose={closeDialog} width="small">
          <DialogHeader title="Dialog Title" onClose={closeDialog} firstFocusableElement={React.createRef()} />
          <DialogBody>
            <p>This is the dialog body.</p>
          </DialogBody>
          <DialogFooter onSave={closeDialog} onClose={closeDialog} />
        </Dialog>
      </>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
      setIsOpen(false);
      console.log('Dialog closed');
      // Add any additional logic or side effects here
    };

    const handleSave = () => {
      console.log('Save button clicked');
      // Add your save logic here
      // For example, you can perform form validation, make API calls, update state, etc.
      // After saving, you can close the dialog if needed
      setIsOpen(false);
    };

    return (
      <Dialog open={isOpen} onClose={handleClose} width="small">
        <DialogHeader title="Dialog Title" onClose={handleClose} firstFocusableElement={React.createRef()} />
        <DialogBody>
          <p>This is the dialog body.</p>
        </DialogBody>
        <DialogFooter onSave={handleSave} onClose={handleClose} />
      </Dialog>
    );
  },
};

export const SingleButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
      setIsOpen(false);
      console.log('Dialog closed');
      // Add any additional logic or side effects here
    };

    return (
      <Dialog open={isOpen} onClose={handleClose} width="small">
        <DialogHeader title="Dialog Title" onClose={handleClose} firstFocusableElement={React.createRef()} />
        <DialogBody>
          <p>This is the dialog body.</p>
        </DialogBody>
        <DialogFooter singleButton onClose={handleClose} />
      </Dialog>
    );
  },
};

export const CustomButtonLabels: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
      <>
        <Button variant="primary" onClick={openDialog}>
          Open Dialog
        </Button>
        <Dialog open={isOpen} onClose={closeDialog} width="small">
          <DialogHeader title="Dialog Title" onClose={closeDialog} firstFocusableElement={React.createRef()} />
          <DialogBody>
            <p>You have unsaved changes. Are you sure you want to close the modal?</p>
          </DialogBody>
          <DialogFooter
            onSave={closeDialog}
            onClose={closeDialog}
            continueButtonLabel="Submit"
            cancelButtonLabel="Dismiss"
          />
        </Dialog>
      </>
    );
  },
};

export const DeleteAction: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
      <>
        <Button variant="danger" onClick={openDialog}>
          Delete Item
        </Button>
        <Dialog open={isOpen} onClose={closeDialog} width="medium">
          <DialogHeader title="Delete Item" onClose={closeDialog} firstFocusableElement={React.createRef()} />
          <DialogBody>
            <p>Are you sure you want to delete this item?</p>
          </DialogBody>
          <DialogFooter onSave={closeDialog} onClose={closeDialog} isDeleteAction />
        </Dialog>
      </>
    );
  },
};

export const HideCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
      <>
        <Button variant="primary" onClick={openDialog}>
          Open Dialog
        </Button>
        <Dialog open={isOpen} onClose={closeDialog} width="small">
          <DialogHeader title="Dialog Title" hideCloseButton />
          <DialogBody>
            <p>This is the dialog body.</p>
          </DialogBody>
          <DialogFooter singleButton onClose={closeDialog} />
        </Dialog>
      </>
    );
  },
};
