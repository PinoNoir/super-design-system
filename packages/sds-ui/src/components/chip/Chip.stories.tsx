import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './Chip';
import { Avatar } from '../avatar';
import { Icon } from '@iconify/react';

const meta: Meta<typeof Chip> = {
  title: 'Components/Data Display/Chip',
  component: Chip,
  parameters: {
    componentSubtitle: 'Compact elements representing an input, attribute, or action',
    docs: {
      description: {
        component: `
Chips allow users to make selections, filter content, or trigger actions.
They are commonly used for attributes, selecting multiple options from a set, or as entry points for more detailed information.
        `,
      },
    },
  },
  argTypes: {
    avatar: {
      control: { type: 'object' },
      description: 'Avatar component displayed at the beginning of the chip',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'The content of the chip',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      options: ['base', 'outline', 'primary'],
      control: { type: 'select' },
      description: 'The visual style variant of the chip',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' },
      },
    },
    isFilterChip: {
      control: { type: 'boolean' },
      description: 'Whether the chip functions as a filter that can be toggled on/off',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isDismissible: {
      control: { type: 'boolean' },
      description: 'Whether the chip can be dismissed with a delete icon',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    active: {
      control: { type: 'boolean' },
      description: 'Whether the chip is in an active/selected state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the chip is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onDelete: {
      action: 'onDelete',
      description: 'Callback fired when the delete icon is clicked',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onClick: {
      action: 'onClick',
      description: 'Callback fired when the chip is clicked',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onActiveChange: {
      action: 'onActiveChange',
      description: "Callback fired when a filter chip's active state changes",
      table: {
        type: { summary: '(active: boolean) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    icon: {
      control: { type: 'object' },
      description: 'Icon displayed before the label',
      table: {
        type: { summary: 'ReactElement' },
      },
    },
    deleteIcon: {
      control: { type: 'object' },
      description: 'Custom delete icon (only shown when isDismissible is true)',
      table: {
        type: { summary: 'ReactElement' },
      },
    },
    component: {
      control: { type: 'object' },
      description: 'The component used for the root node',
      table: {
        type: { summary: 'React.ElementType' },
        defaultValue: { summary: 'div' },
      },
    },
    href: {
      control: { type: 'text' },
      description: 'The URL to link to when the chip is clicked (renders as an anchor)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'CSS class to apply to the chip',
      table: {
        type: { summary: 'string' },
      },
    },
    id: {
      control: { type: 'text' },
      description: 'The id attribute of the chip',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

/**
 * Default chip with basic styling and text label.
 */
export const Default: Story = {
  args: {
    label: 'Default Chip',
  },
};

/**
 * Chip with an avatar image or initial at the beginning.
 */
export const WithAvatar: Story = {
  args: {
    avatar: <Avatar size="sm">P</Avatar>,
    label: 'Chip with Avatar',
  },
};

/**
 * Chip with an icon preceding the label text.
 */
export const WithIcon: Story = {
  args: {
    icon: <Icon icon="mdi:heart" width="18px" />,
    label: 'Chip with Icon',
  },
};

/**
 * Outlined variant with transparent background.
 */
export const Outlined: Story = {
  args: {
    label: 'Outlined Chip',
    variant: 'outline',
  },
};

/**
 * Color variants to indicate different semantic meanings.
 */
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip label="Base" variant="base" />
      <Chip label="Primary" variant="primary" />
      <Chip label="Outline" variant="outline" />
    </div>
  ),
};

/**
 * Dismissible chip with a delete icon that removes the chip when clicked.
 */
export const Dismissible: Story = {
  args: {
    label: 'Dismissible Chip',
    isDismissible: true,
    onDelete: () => console.log('Delete clicked'),
  },
};

/**
 * Chip with a custom delete icon.
 */
export const WithCustomDeleteIcon: Story = {
  args: {
    label: 'Custom Delete Icon',
    isDismissible: true,
    onDelete: () => console.log('Delete clicked'),
    deleteIcon: <Icon icon="mdi:delete" />,
  },
};

/**
 * Chip that functions as a hyperlink.
 */
export const AsLink: Story = {
  args: {
    label: 'Link Chip',
    href: 'https://www.example.com',
    target: '_blank',
  },
};

/**
 * Disabled chip that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Chip',
    disabled: true,
    onClick: () => console.log('This will not be called'),
  },
};

/**
 * Chip that can be toggled between active and inactive states.
 */
export const FilterChip: Story = {
  args: {
    label: 'Filter Chip',
    isFilterChip: true,
    active: false,
    onActiveChange: (active) => console.log(`Active state changed to: ${active}`),
  },
};

/**
 * Active filter chip showing the selected state.
 */
export const ActiveFilterChip: Story = {
  args: {
    label: 'Active Filter',
    isFilterChip: true,
    active: true,
    onActiveChange: (active) => console.log(`Active state changed to: ${active}`),
  },
};

/**
 * Interactive example showing how chips can be used in a real-world filtering scenario.
 */
export const ChipGroup: Story = {
  render: function ChipGroup() {
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['React']);

    const toggleFilter = (filter: string) => {
      if (selectedFilters.includes(filter)) {
        setSelectedFilters(selectedFilters.filter((f) => f !== filter));
      } else {
        setSelectedFilters([...selectedFilters, filter]);
      }
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Selected filters:</strong> {selectedFilters.join(', ') || 'None'}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip
            label="React"
            isFilterChip
            active={selectedFilters.includes('React')}
            onActiveChange={() => toggleFilter('React')}
            variant="primary"
          />
          <Chip
            label="TypeScript"
            isFilterChip
            active={selectedFilters.includes('TypeScript')}
            onActiveChange={() => toggleFilter('TypeScript')}
            variant="primary"
          />
          <Chip
            label="CSS"
            isFilterChip
            active={selectedFilters.includes('CSS')}
            onActiveChange={() => toggleFilter('CSS')}
            variant="primary"
          />
          <Chip
            label="JavaScript"
            isFilterChip
            active={selectedFilters.includes('JavaScript')}
            onActiveChange={() => toggleFilter('JavaScript')}
            variant="primary"
          />
          <Chip
            label="HTML"
            isFilterChip
            active={selectedFilters.includes('HTML')}
            onActiveChange={() => toggleFilter('HTML')}
            variant="primary"
          />
        </div>
      </div>
    );
  },
};

/**
 * Interactive example showing dismissible chips in action.
 */
export const DismissibleChipGroup: Story = {
  args: {
    variant: 'outline',
  },

  render: function DismissibleChipGroup(args) {
    const { variant } = args;

    const [chips, setChips] = React.useState([
      { id: 1, label: 'JavaScript' },
      { id: 2, label: 'React' },
      { id: 3, label: 'TypeScript' },
      { id: 4, label: 'CSS' },
      { id: 5, label: 'HTML' },
    ]);

    const handleDelete = (id: number) => {
      setChips(chips.filter((chip) => chip.id !== id));
    };

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            variant={variant}
            isDismissible
            onDelete={() => handleDelete(chip.id)}
          />
        ))}
        {chips.length === 0 && <div>All chips have been dismissed. Refresh to reset.</div>}
      </div>
    );
  },
};
