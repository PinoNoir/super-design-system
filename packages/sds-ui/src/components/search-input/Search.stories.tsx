import type { Meta, StoryObj } from '@storybook/react-vite';
import Search, { SearchProps } from './Search';
import { useState } from 'react';
import { useDataSearch } from '../../hooks';

const meta: Meta<typeof Search> = {
  title: 'Components/Inputs/Search Input',
  component: Search,
  args: {
    placeholder: 'Search...',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    isExpanded: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    hideLabel: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Search>;

export const Default: Story = {
  render: () => <Search placeholder="Search Clients..." />,
};

export const WithLabel: Story = {
  render: () => <Search label="Search" hideLabel={false} placeholder="Search Clients..." />,
};

export const Disabled: Story = {
  render: () => <Search disabled placeholder="Search Clients..." />,
};

export const WithDefaultValue: Story = {
  render: () => <Search defaultValue="Initial value" placeholder="Search Clients..." />,
};

export const ControlledSearch: Story = {
  render: function ControlledSearch() {
    const [value, setValue] = useState('');
    return <Search value={value} onChange={(e) => setValue(e.target.value)} placeholder="Controlled search" />;
  },
};

export const ExpandableSearch: Story = {
  render: function ExpandableSearch() {
    const [isExpanded, setIsExpanded] = useState(false);
    return <Search isExpanded={isExpanded} onExpand={() => setIsExpanded(!isExpanded)} placeholder="Click to expand" />;
  },
};

export const WithCustomStyles: Story = {
  render: () => (
    <Search
      className="custom-search"
      style={{
        backgroundColor: '#f0f0f0',
        border: '2px solid blue',
        borderRadius: '20px',
      }}
      placeholder="Custom styled search"
    />
  ),
};

export const SearchWithCallback: Story = {
  render: () => {
    const handleSearch = (event: { target: HTMLInputElement; type: 'change' }) => {
      console.log('Search term:', event.target.value);
    };
    return <Search onChange={handleSearch} placeholder="Type to see console log" />;
  },
};

export const FullyFeatured: Story = {
  render: function FullyFeatured(args: SearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { handleSearch, handleClear, searchTerm } = useDataSearch([]);

    return (
      <Search
        {...args}
        label={args.label}
        hideLabel={false}
        isExpanded={isExpanded}
        onExpand={() => setIsExpanded(!isExpanded)}
        value={searchTerm}
        onChange={handleSearch}
        onClear={handleClear}
        placeholder={args.placeholder}
      />
    );
  },
};
