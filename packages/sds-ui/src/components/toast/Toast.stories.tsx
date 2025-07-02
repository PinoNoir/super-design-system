import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Button } from '../button';
import { Toast, ToastProvider } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  parameters: {},
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
    },
    variant: {
      options: ['alert', 'success', 'error'],
      control: { type: 'select' },
    },
    onClose: {
      action: 'onClose',
      type: 'function',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    const closeToast = () => {
      setOpen(false);
    };

    return (
      <>
        <Button
          variant="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Open Toast
        </Button>
        <ToastProvider swipeDirection="right">
          <Toast
            {...args}
            header="Alert"
            onClose={closeToast}
            open={open}
            message="This is a toast message description"
            hyperlinkText="This is an optional hyperlink"
            duration={10000}
          />
        </ToastProvider>
      </>
    );
  },
};

export const Alert = {
  args: {
    variant: 'alert',
    className: 'ClassName',
    message: 'Alert Message',
    header: 'Alert',
  },
};

export const AlertWithLink = {
  args: {
    variant: 'alert',
    header: 'Alert',
    className: 'ClassName',
    message: 'Alert Message',
    url: '#',
    hyperlinkText: 'Link',
  },
};

export const Success = {
  args: {
    variant: 'success',
    header: 'Success',
    className: 'ClassName',
    message: 'Success Message',
  },
};

export const SuccessWithLink = {
  args: {
    variant: 'success',
    header: 'Success',
    className: 'ClassName',
    message: 'Success Message',
    url: '#',
    hyperlinkText: 'Link',
  },
};

export const Error = {
  args: {
    variant: 'error',
    header: 'Error',
    className: 'ClassName',
    message: 'Error Message',
  },
};

export const ErrorWithLink = {
  args: {
    variant: 'error',
    className: 'ClassName',
    message: 'Error Message',
    header: 'Error',
    url: '#',
    hyperlinkText: 'Link',
  },
};
