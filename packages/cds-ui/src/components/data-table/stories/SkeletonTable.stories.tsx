import type { Meta, StoryObj } from '@storybook/react';
import SkeletonTable from '../SkeletonTable';

const meta: Meta<typeof SkeletonTable> = {
  title: 'Components/Data Display/Data Table/Skeleton Table',
  component: SkeletonTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A skeleton loading component that displays placeholder content while data is being fetched. Supports different cell variants to match various data types.',
      },
    },
  },
  argTypes: {
    rows: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Number of skeleton rows to display',
    },
    columns: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Number of columns in the table',
    },
    cellVariants: {
      control: { type: 'object' },
      description: 'Array defining the content type for each column',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 5,
    columns: 4,
  },
};

export const UserTable: Story = {
  name: 'User Table',
  args: {
    rows: 6,
    columns: 5,
    cellVariants: ['avatar', 'text', 'text', 'badge', 'badge'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A skeleton for a user management table with avatar, name, email, role, and status columns.',
      },
    },
  },
};

export const ProductTable: Story = {
  name: 'Product Table',
  args: {
    rows: 8,
    columns: 6,
    cellVariants: ['text', 'text', 'number', 'number', 'badge', 'date'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A skeleton for a product inventory table with name, description, price, quantity, status, and date columns.',
      },
    },
  },
};

export const SimpleList: Story = {
  name: 'Simple List',
  args: {
    rows: 10,
    columns: 2,
    cellVariants: ['text', 'date'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal two-column layout for simple lists or reports.',
      },
    },
  },
};

export const ContactList: Story = {
  name: 'Contact List',
  args: {
    rows: 7,
    columns: 4,
    cellVariants: ['avatar', 'text', 'text', 'badge'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A contact list with avatar, name, email/phone, and status information.',
      },
    },
  },
};

export const AnalyticsTable: Story = {
  name: 'Analytics Table',
  args: {
    rows: 6,
    columns: 5,
    cellVariants: ['text', 'number', 'number', 'number', 'badge'],
  },
  parameters: {
    docs: {
      description: {
        story: 'An analytics dashboard table with metrics, numbers, and status indicators.',
      },
    },
  },
};

export const LargeDataset: Story = {
  name: 'Large Dataset',
  args: {
    rows: 15,
    columns: 8,
    cellVariants: ['text', 'text', 'number', 'date', 'badge', 'text', 'number', 'badge'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive table skeleton for large datasets with mixed content types.',
      },
    },
  },
};

export const CompactView: Story = {
  name: 'Compact View',
  args: {
    rows: 12,
    columns: 3,
    cellVariants: ['text', 'number', 'badge'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A compact three-column view suitable for mobile or sidebar displays.',
      },
    },
  },
};

// Interactive playground story
export const Playground: Story = {
  name: 'Playground',
  args: {
    rows: 5,
    columns: 4,
    cellVariants: ['text', 'text', 'badge', 'date'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different configurations. Try changing the controls in the panel below!',
      },
    },
  },
};