import { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';
import { Button } from '../button';

const meta: Meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  argTypes: {
    onActionClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const WithActions: Story = {
  render: () => {
    return (
      <EmptyState title="This is an Empty State Title" description="This is an Empty State Description">
        <Button
          variant="primary"
          onClick={() => {
            console.log('primary-click-action');
          }}
        >
          Primary Action
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            console.log('secondary-click-action');
          }}
        >
          Secondary Action
        </Button>
      </EmptyState>
    );
  },
};

export const WithNoActions: Story = {
  render: () => {
    return <EmptyState title="This is an Empty State Title" description="This is an Empty State Description" />;
  },
};
