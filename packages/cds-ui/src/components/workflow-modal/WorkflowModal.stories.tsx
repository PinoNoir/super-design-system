import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import WorkflowModal, { WorkflowModalProps } from './WorkflowModal';
import { Button } from '../button';

const meta: Meta = {
  title: 'Components/Popovers/Workflow Modal',
  component: WorkflowModal,
  tags: ['!autodocs'],
  argTypes: {
    isOpen: { control: { type: 'boolean' } },
    onClose: {
      action: 'onClose',
      type: 'function',
    },
    title: { control: { type: 'text' } },
  },
};

export default meta;

type Story = StoryObj<typeof WorkflowModal>;

const BasicModalExample: React.FC<WorkflowModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const customFooter = (
    <Button type="submit" variant="primary">
      Submit
    </Button>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        Open Modal
      </Button>
      <WorkflowModal
        {...args}
        title="Basic Modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={customFooter}
      >
        <p>This is a basic modal example.</p>
      </WorkflowModal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <BasicModalExample {...args} />,
};
