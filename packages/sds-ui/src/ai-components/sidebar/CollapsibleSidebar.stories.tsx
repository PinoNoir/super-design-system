import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Sidebar, { SidebarProps } from './Sidebar';
import { SidebarLogo, SidebarSectionStatic, SidebarItem } from './';
import { LogOut, Search, FilePlus2, MessageCircle } from 'lucide-react';

const defaultSections: SidebarProps['sections'] = [
  {
    id: 'default',
    title: '',
    items: [
      { id: 'search', label: 'Search Chat', icon: <Search />, href: '#' },
      { id: 'new-conversation', label: 'New Conversation', icon: <FilePlus2 />, href: '#' },
    ],
  },
  {
    id: 'main',
    title: 'Pinned',
    items: [
      { id: 'chat-1', label: 'Chapter 7 Filing Strategy Analysis', icon: <MessageCircle />, href: '#' },
      { id: 'chat-2', label: 'Asset Protection Research', icon: <MessageCircle />, href: '#' },
    ],
  },
  {
    id: 'history',
    title: 'History',
    items: [
      { id: 'chat-5', label: 'Automatic Stay Analysis - Johnson Case', icon: <MessageCircle />, href: '#' },
      { id: 'chat-6', label: 'Ch. 13 Payment Plan Calculator', icon: <MessageCircle />, href: '#' },
    ],
  },
];

const meta: Meta<typeof Sidebar> = {
  title: 'AI Components/Sidebar/Collapsible',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Collapsible: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => setCollapsed((c) => !c);

    return (
      <>
        <div
          style={{
            height: '60px',
            width: '100%',
            padding: 'var(--space-16)',
            backgroundColor: 'var(--theme-color-component)',
            borderBlockEnd: '1px solid var(--theme-border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <SidebarLogo collapsible collapsed={collapsed} onToggleCollapse={toggle} />
        </div>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar {...args} collapsible collapsed={collapsed} onToggleCollapse={toggle} hideHeader />

          <div
            style={{
              flex: 1,
              padding: '2rem',
              backgroundColor: 'var(--theme-color-background)',
            }}
          >
            <h2>Main Content Area</h2>
            <p>This simulates the main application content alongside the sidebar.</p>
          </div>
        </div>
      </>
    );
  },
  args: {
    sections: defaultSections,
    footer: (
      <SidebarSectionStatic>
        <SidebarItem icon={<LogOut />} label="Sign Out" onClick={() => alert('Sign Out clicked!')} as="a" />
      </SidebarSectionStatic>
    ),
  },
};
