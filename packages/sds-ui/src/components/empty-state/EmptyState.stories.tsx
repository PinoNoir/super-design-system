import { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';
import { Button } from '../button';

const meta: Meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  argTypes: {
    illustration: {
      control: 'select',
      options: ['search', 'empty-data', 'error', 'no-results', 'loading', 'custom', null],
      description: 'Type of illustration to display',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the empty state',
    },
    centered: {
      control: 'boolean',
      description: 'Whether to center the content',
    },
    onActionClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

// Original stories (preserved)
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

// New stories showcasing enhanced features
export const SearchResults: Story = {
  render: () => (
    <EmptyState
      title="No search results found"
      description="We couldn't find any items matching your search criteria. Try adjusting your filters or search terms."
      illustration="search"
    >
      <Button variant="secondary">Clear filters</Button>
      <Button variant="primary">Browse all items</Button>
    </EmptyState>
  ),
};

export const DataTable: Story = {
  render: () => (
    <EmptyState
      title="No data available"
      description="Start by importing your data or creating your first entry."
      illustration="empty-data"
      size="medium"
    >
      <Button variant="primary">Import data</Button>
      <Button variant="secondary">Create entry</Button>
    </EmptyState>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <EmptyState
      title="Unable to load content"
      description="Something went wrong while loading this data. Please try again."
      illustration="error"
    >
      <Button variant="primary">Retry</Button>
      <Button variant="secondary">Go back</Button>
    </EmptyState>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <EmptyState
      title="Loading your data..."
      description="Please wait while we fetch your information."
      illustration="loading"
    />
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Small</h3>
        <EmptyState
          title="Small empty state"
          description="This is a compact version for smaller spaces."
          illustration="empty-data"
          size="small"
        >
          <Button variant="primary" size="small">
            Action
          </Button>
        </EmptyState>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Medium (Default)</h3>
        <EmptyState
          title="Medium empty state"
          description="This is the default size for most use cases."
          illustration="empty-data"
          size="medium"
        >
          <Button variant="primary">Action</Button>
        </EmptyState>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Large</h3>
        <EmptyState
          title="Large empty state"
          description="This is a prominent version for main content areas."
          illustration="empty-data"
          size="large"
        >
          <Button variant="primary" size="large">
            Action
          </Button>
        </EmptyState>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const LeftAligned: Story = {
  render: () => (
    <EmptyState
      title="Project dashboard"
      description="You haven't created any projects yet. Start by creating your first project to see it here."
      illustration="empty-data"
      centered={false}
    >
      <Button variant="primary">Create project</Button>
      <Button variant="secondary">Import project</Button>
    </EmptyState>
  ),
};

export const NoIllustration: Story = {
  render: () => (
    <EmptyState
      title="Feature coming soon"
      description="This functionality will be available in the next release. Stay tuned for updates!"
      illustration={null}
    >
      <Button variant="secondary">Learn more</Button>
      <Button variant="primary">Get notified</Button>
    </EmptyState>
  ),
};

export const ComplexActions: Story = {
  render: () => (
    <EmptyState
      title="No team members"
      description="Collaborate with your team by inviting members to this workspace."
      illustration="empty-data"
      actions={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="primary">Invite members</Button>
            <Button variant="secondary">Import contacts</Button>
          </div>
          <Button variant="tertiary" size="small">
            Skip for now
          </Button>
        </div>
      }
    />
  ),
};

export const MinimalContent: Story = {
  render: () => <EmptyState title="No notifications" illustration="empty-data" size="small" />,
};

export const InteractivePlayground: Story = {
  args: {
    title: 'Playground Empty State',
    description: 'Use the controls below to customize this empty state',
    illustration: 'empty-data',
    size: 'medium',
    centered: true,
  },
  render: (args) => (
    <EmptyState {...args}>
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
    </EmptyState>
  ),
};
